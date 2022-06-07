import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './entities/Player';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [
    {
      _id: '123-123-123',
      name: 'Jessé Jonas',
      email: 'jessejonas13@gmail.com',
      phoneNumber: '98985446484',
      imageUrl: 'https://avatars.githubusercontent.com/u/29109974?v=4',
      ranking: 'A',
      rankingPosition: 6,
    },
  ];

  async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { name, email, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuid(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      imageUrl: 'https://avatars.githubusercontent.com/u/29109974?v=4',
    };

    this.players.push(player);
  }
}
