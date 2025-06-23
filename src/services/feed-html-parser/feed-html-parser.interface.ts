import { IFeed } from "../../models/feed.interface";

export type FeedHtmlParserConstructor = new (...args: any[]) => IFeedHtmlParser

export interface IFeedHtmlParser {
    parseFrontPage(pageHtml: string, pageDate: Date): IFeed[]
}