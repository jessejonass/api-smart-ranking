import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players') // route
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('create') // api/v1/players/create
  @UsePipes(ValidationPipe)
  async create(@Body() player: CreatePlayerDto) {
    this.playersService.create(player);
    return player;
  }

  @Patch('update')
  async update(@Query('email') email: string, @Body() player: CreatePlayerDto) {
    return this.playersService.update(email, player);
  }

  @Delete('delete')
  async delete(@Query('email') email: string) {
    console.log('email', email);
    return this.playersService.delete(email);
  }

  @Get('all')
  async findAll() {
    return this.playersService.findAll();
  }

  @Get('find')
  async findOne(@Query('email') email: string) {
    return this.playersService.findOne(email);
  }
}
