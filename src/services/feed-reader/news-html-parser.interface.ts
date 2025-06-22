import { IFeed } from "../../models/feed.interface";

export interface INewsHtmlParser {
    parseFrontPage(pageHtml: string, pageDate: Date): IFeed[]
}