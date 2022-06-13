import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@nestjs-api-smart-rankin.l80zm.mongodb.net/?retryWrites=true&w=majority',
    ),
    CategoriesModule,
    ChallengesModule,
    MatchesModule,
  ],
  controllers: [],
})
export class AppModule {}
