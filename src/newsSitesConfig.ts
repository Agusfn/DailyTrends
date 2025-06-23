import { ElMundoFeedHtmlParserService, ElPaisFeedHtmlParserService, FeedHtmlParserConstructor } from "./services/feed-html-parser";

export const newsSitesConfig: { url: string, HtmlParser: FeedHtmlParserConstructor }[] = [
    { url: "https://www.elmundo.es/", HtmlParser: ElMundoFeedHtmlParserService },
    { url: "https://elpais.com/", HtmlParser: ElPaisFeedHtmlParserService }
]