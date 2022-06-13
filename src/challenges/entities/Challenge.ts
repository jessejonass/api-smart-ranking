import { Document } from 'mongoose';
import { Player } from 'src/players/entities/Player';
import { ChallengeStatusEnum } from './ChallengeStatus.enum';

export class Challenge extends Document {
  challengeDatetime: Date;
  status: keyof typeof ChallengeStatusEnum;
  challengeRequestDatetime: Date;
  challengeResponseDatetime: Date;
  requester: Player;
  category: string;
  player: Player[];
  match: Match[];
}

export type Match = {
  category: string;
  def: Player;
  players: Player[];
  result: Result;
};

export type Result = {
  set: string;
};
