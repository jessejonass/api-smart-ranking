import { Document } from 'mongoose';
import { Player } from 'src/players/entities/Player';

export class Challenge extends Document {
  challengeDatetime: Date;
  status: keyof typeof ChallengStatus;
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

export enum ChallengStatus {
  REALIZED = 'DONE',
  PENDING = 'PENDING',
  ACCEPTED = 'I ACCEPT',
  DENIED = 'DENIED',
  CANCELED = 'CANCELED',
}
