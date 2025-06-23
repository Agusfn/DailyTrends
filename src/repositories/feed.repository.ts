import { Service } from "typedi";
import { IFeedRepository } from "./feed.repository.interface";
import { Feed } from "../models/feed.model.";
import { IFeed } from "../models/feed.interface";

@Service()
export class FeedRepository implements IFeedRepository {

    findById(id: string): Promise<IFeed | null> {
        return Feed.findById(id);
    }
    
    findAll() {
        return Feed.find();
    }

    create(data: IFeed | IFeed[]) {
        return Feed.create(data);
    }

    update(id: string, data: Partial<IFeed>): Promise<IFeed | null> {
        return Feed.findByIdAndUpdate(id, data, { new: true });
    }

    delete(id: string): Promise<IFeed | null> {
        return Feed.findByIdAndDelete(id);
    }

    async createIfNotExists(feed: IFeed) {
        const exists = await Feed.findOne({
            article_url: feed.article_url
        });

        return exists || Feed.create(feed);
    }


    getOfCurrentDate(): Promise<IFeed[]> {

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        return Feed.find({
            date: { $gte: start, $lte: end }
        });
    }


}