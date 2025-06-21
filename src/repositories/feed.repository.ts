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

    create(data: IFeed) {
        return Feed.create(data);
    }

    update(id: string, data: Partial<IFeed>): Promise<IFeed | null> {
        return Feed.findByIdAndUpdate(id, data, { new: true });
    }

    delete(id: string): Promise<IFeed | null> {
        return Feed.findByIdAndDelete(id);
    }

}