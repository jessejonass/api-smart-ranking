import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './entities/Player';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private async playerExists(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerAlreadyExists = await this.playerModel
      .findOne({ email })
      .exec();

    if (playerAlreadyExists) {
      throw new BadRequestException('Player already exists');
    }

    const player = new this.playerModel(createPlayerDto);
    return await player.save();
  }

  async findAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findOne(_id: string): Promise<Player> {
    return await this.playerExists(_id);
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
    await this.playerExists(_id);
    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async delete(_id: string): Promise<any> {
    await this.playerExists(_id);
    return await this.playerModel.findOneAndDelete({ _id }).exec();
  }
}
