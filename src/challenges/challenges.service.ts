import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { AddMatchToChallengeDto } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './entities/Challenge';
import { ChallengeStatusEnum } from './entities/ChallengeStatus.enum';
import { Match } from './entities/Match';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    // check requester player exists
    await this.playersService.findOne(createChallengeDto.requester._id);

    // check requester player is challenged
    const requesterIsRequested = createChallengeDto.players.some(
      (player) => player._id === createChallengeDto.requester._id,
    );

    if (!requesterIsRequested)
      throw new BadRequestException('Requester must be in the challenge');

    // check requested players exists
    const players = await this.playersService.findAll();
    createChallengeDto.players.map((player) => {
      const playerFilter = players.some(
        (p) => String(p._id) === String(player._id),
      );
      if (!playerFilter)
        throw new BadRequestException(`Player: ${player._id} does not exist`);
    });

    // check player requester has category
    const { category } = await this.categoriesService.findPlayerCategory(
      createChallengeDto.requester._id,
    );

    const challenge = {
      ...createChallengeDto,
      category,
      challengeRequestDatetime: new Date(),
      status: ChallengeStatusEnum.PENDING,
    };

    const newChallenge = new this.challengeModel(challenge);
    return await newChallenge.save();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().exec();
  }

  async findByPlayer(playerId: string): Promise<Challenge[]> {
    await this.playersService.findOne(playerId);

    const challenge = await this.challengeModel
      .find()
      .where('requester')
      .equals(playerId)
      .populate('requester, players, match')
      .exec();

    return challenge;
  }

  async findOne(challengeId: string): Promise<Challenge> {
    const challenge = await this.challengeModel
      .findOne({ _id: challengeId })
      .populate('requester players match');

    if (!challenge) {
      throw new BadRequestException(`Challenge ${challengeId} not found`);
    }

    return challenge;
  }

  async update(
    challengeId: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const challenge = await this.findOne(challengeId);

    if (updateChallengeDto.status) {
      challenge.challengeResponseDatetime = new Date();
    }

    challenge.status = updateChallengeDto.status;
    challenge.challengeDatetime = updateChallengeDto.challengeDatetime;

    await this.challengeModel
      .findOneAndUpdate({ _id: challengeId }, { $set: challenge })
      .exec();

    return challenge;
  }

  async addMatchToChallenge(
    challengeId: string,
    addMatchToChallengeDto: AddMatchToChallengeDto,
  ): Promise<any> {
    // check challenge exists
    const challenge = await this.findOne(challengeId);

    // check player exists on challenge
    const playerExistsOnChallenge = challenge.players.some(
      (player) => String(player._id) === String(addMatchToChallengeDto.def),
    );
    if (!playerExistsOnChallenge) {
      throw new BadRequestException(
        `Player: ${addMatchToChallengeDto.def} does not exists on challenge`,
      );
    }

    // create and save match
    const newMatch = new this.matchModel(addMatchToChallengeDto);
    const match = await newMatch.save();

    // update challenge withg status done and match result
    challenge.status = ChallengeStatusEnum.DONE;
    challenge.match = match._id;

    try {
      await this.challengeModel
        .findByIdAndUpdate({ _id: challengeId }, { $set: challenge })
        .exec();
    } catch (err) {
      await this.matchModel.deleteOne({ _id: match._id });
      throw new BadRequestException(
        'Match not found. this match has been deleted',
      );
    }
  }

  async delete(_id: string): Promise<void> {
    const challenge = await this.challengeModel.findById(_id).exec();

    if (!challenge) {
      throw new BadRequestException(`Challenge ${_id} not found`);
    }

    challenge.status = ChallengeStatusEnum.CANCELED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challenge })
      .exec();
  }
}
