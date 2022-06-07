import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './entities/Player';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    const playerExists = this.players.find(
      (p) => p.email === createPlayerDto.email,
    );

    if (playerExists) {
      throw new HttpException('Player already exists', HttpStatus.BAD_REQUEST);
    }

    const player: Player = {
      _id: uuid(),
      name: createPlayerDto.name,
      email: createPlayerDto.email,
      phoneNumber: createPlayerDto.phoneNumber,
      imageUrl: createPlayerDto.imageUrl,
      ranking: 'A',
      rankingPosition: 1,
    };

    this.players.push(player);
  }

  async update(email: string, updatePlayerDto: CreatePlayerDto): Promise<void> {
    const playerIndex = this.players.findIndex((p) => p.email === email);

    if (playerIndex <= -1) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }

    const player: Player = {
      _id: uuid(),
      name: updatePlayerDto.name,
      email: updatePlayerDto.email,
      phoneNumber: updatePlayerDto.phoneNumber,
      imageUrl: updatePlayerDto.imageUrl,
      ranking: 'A',
      rankingPosition: 1,
    };

    this.players[playerIndex] = player;
  }

  async delete(email: string): Promise<void> {
    const playerIndex = this.players.findIndex((p) => p.email === email);

    if (playerIndex <= -1) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    } else {
      this.players.splice(playerIndex, 1);
    }
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async findOne(email: string): Promise<Player> {
    const playerExists = this.players.find((player) => player.email === email);

    if (!playerExists) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }

    return playerExists;
  }
}
