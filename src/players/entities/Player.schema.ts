import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    enum: String,
    ranking: String,
    rankingPosition: Number,
    imageUrl: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
