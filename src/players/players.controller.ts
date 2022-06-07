import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players') // path | route
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() player: CreatePlayerDto) {
    await this.playersService.create(player);
    return player;
  }
}
