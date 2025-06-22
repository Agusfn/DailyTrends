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
  main_video_url: String,
  media_caption: String,
  author_name: String,
  author_role: String,
  author_thumbnail_url: String,
  body_html: String,
  body_plain_text: String,
  is_opinion: Boolean,
  is_premium: Boolean,
  sponsor: String
});

export const Feed = mongoose.model('Feed', FeedSchema);