import { Document } from 'mongoose';
import { Player } from 'src/players/entities/Player';

export class Challenge extends Document {
  challengeDatetime: Date;
  status: string;
  challengeRequestDatetime: Date;
  challengeResponseDatetime: Date;
  requester: string;
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
