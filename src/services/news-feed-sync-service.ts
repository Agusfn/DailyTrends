import { FeedHtmlParserConstructor, IFeedHtmlParser } from "./feed-html-parser/feed-html-parser.interface";
import { Inject, Service } from "typedi";
import { INewsPageFetcher, INewsPageFetcherToken } from "./news-page-fetcher.interface";
import { IFeedRepository, IFeedRepositoryToken } from "../repositories/feed.repository.interface";


@Service()
export class NewsFeedSyncService {

    /**
     * The configured news website urls among with their Html Parser classes.
     */
    private newsSitesConfig: { url: string, HtmlParser: FeedHtmlParserConstructor }[] = [];

    constructor(
        @Inject(INewsPageFetcherToken) private newsSiteFetcher: INewsPageFetcher,
        @Inject(IFeedRepositoryToken) private feedRepository: IFeedRepository
    ) {

    }

    /**
     * Set the configuration news websites to be parsed and stored.
     * @param configs 
     */
    public setNewsSitesConfig(configs: { url: string, HtmlParser: FeedHtmlParserConstructor }[]) {
        this.newsSitesConfig = configs;
    }

    /**
     * Fetch the front page of all configured news sites and store new articles (Feed) in database.
     */
    public async fetchNewsFromAllSites(date?: Date): Promise<void> {
        const fetchAllWebsites = this.newsSitesConfig.map(config => this.fetchNewsFrontPage(config.url, config.HtmlParser, date));
        await Promise.all(fetchAllWebsites);
    }

    /**
     * Fetch a news front page website, parse their articles, and store new articles into database.
     * @param frontPageUrl The uri of the front page of the news articles website.
     * @param HtmlParserClass The constructor or class of the HtmlParser for the given website.
     */
    private async fetchNewsFrontPage(frontPageUrl: string, HtmlParserClass: new (...args: any[]) => IFeedHtmlParser, date = new Date()) {

        try {
            const pageHtml = await this.newsSiteFetcher.fetchPageHtml(frontPageUrl);

            const htmlParserService = new HtmlParserClass();
            const feeds = htmlParserService.parseFrontPage(pageHtml, date);

            for(const feed of feeds) {
                await this.feedRepository.createIfNotExists(feed);
            }

        } catch(error) {
            console.log("Could not save feed", error);
        }

    }


}