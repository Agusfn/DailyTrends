import { IFeed } from "../models/feed.interface"

export const IFeedRepositoryToken = "IFeedRepository";

export interface IFeedRepository {
    findById(id: string): Promise<IFeed | null>;
    findAll(): any;
    create(data: IFeed | IFeed[]): Promise<IFeed>;
    update(id: string, data: Partial<IFeed>): Promise<IFeed | null>;
    delete(id: string): Promise<IFeed | null>;
    createIfNotExists(feed: IFeed): Promise<IFeed>;
    getOfCurrentDate(): Promise<IFeed[]>
}

