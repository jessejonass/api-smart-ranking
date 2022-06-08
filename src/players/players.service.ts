import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './entities/Player';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    return await player.save();
  }

  async update(
    email: string,
    updatePlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ email }, updatePlayerDto)
      .exec();
  }

  async delete(email: string): Promise<any> {
    return await this.playerModel.findOneAndRemove({ email }).exec();
  }

  async findAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findOne(email: string): Promise<Player> {
    return await this.playerModel.findOne({ email }).exec();
  }
}
