import { Document } from 'mongoose';

export class Event extends Document {
  name: string;
  operation: string;
  value: number;
}
