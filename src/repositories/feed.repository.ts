import { Service } from "typedi";
import { IFeedRepository } from "./feed.repository.interface";
import { Feed } from "../models/feed";

@Service()
export class FeedRepository implements IFeedRepository {
    
    
    findAll() {
        return Feed.find();
    }

    

}