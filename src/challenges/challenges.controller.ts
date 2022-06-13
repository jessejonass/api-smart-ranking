import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationChallengeStatusPipe } from 'src/common/pipes/validation-challenge-status.pipe';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './entities/Challenge';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  async findAll(): Promise<Challenge[]> {
    return await this.challengesService.findAll();
  }

  @Get(':challengeId')
  async findOne(@Param('challengeId') challengeId: string): Promise<Challenge> {
    return await this.challengesService.findOne(challengeId);
  }

  @Get(':playerId')
  async findByPlayer(
    @Param('playerId') playerId: string,
  ): Promise<Challenge[]> {
    return this.challengesService.findByPlayer(playerId);
  }

  @Put(':challengeId')
  @UsePipes(ValidationPipe)
  async updated(
    @Body(ValidationChallengeStatusPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challengeId') challengeId: string,
  ): Promise<Challenge> {
    return await this.challengesService.update(challengeId, updateChallengeDto);
  }
}
