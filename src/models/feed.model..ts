import mongoose from 'mongoose';
import { IFeed } from './feed.interface';

const FeedSchema = new mongoose.Schema<IFeed>({
  source: String,
  article_url: String,
  title: String,
  subtitle: String,
  category: String,
  location: String,
  date: Date,
  main_image_url: String,
  author_name: String,
  author_thumbnail_url: String,
  body_html: String,
  body_plain_text: String
});

export const Feed = mongoose.model('Feed', FeedSchema);