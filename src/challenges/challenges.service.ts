import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Challenge, ChallengStatus } from './entities/Challenge';

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
      status: ChallengStatus.PENDING,
    };

    const newChallenge = new this.challengeModel(challenge);
    return await newChallenge.save();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().exec();
  }
}
