import { Document } from 'mongoose';
import { Player } from 'src/players/entities/Player';
import { Result } from './Result';

export class Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}
