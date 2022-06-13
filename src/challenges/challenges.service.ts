import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './entities/Challenge';
import { ChallengeStatusEnum } from './entities/ChallengeStatus.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
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
    const challenge = await this.challengeModel.findOne({ _id: challengeId });

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
}
