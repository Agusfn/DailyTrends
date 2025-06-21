import mongoose from 'mongoose';

export const Feed = mongoose.model('Feed', new mongoose.Schema({
  name: String
}));