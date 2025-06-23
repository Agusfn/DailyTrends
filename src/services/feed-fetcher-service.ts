import axios from "axios";
import { FeedHtmlParserConstructor, IFeedHtmlParser } from "./feed-html-parser/feed-html-parser.interface";
import { Service } from "typedi";
import { FeedRepository } from "../repositories/feed.repository";
import iconv from 'iconv-lite';


@Service()
export class FeedFetcherService {

    /**
     * The configured news website urls among with their Html Parser classes.
     */
    private newsSitesConfig: { url: string, HtmlParser: FeedHtmlParserConstructor }[] = [];

    constructor(private feedRepository: FeedRepository) {

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
    public async fetchNewsFromAllSites(): Promise<void> {
        const fetchAllWebsites = this.newsSitesConfig.map(config => this.fetchNewsFrontPage(config.url, config.HtmlParser));
        await Promise.all(fetchAllWebsites);
    }

    /**
     * Fetch a news front page website, parse their articles, and store new articles into database.
     * @param frontPageUrl The uri of the front page of the news articles website.
     * @param HtmlParserClass The constructor or class of the HtmlParser for the given website.
     */
    private async fetchNewsFrontPage(frontPageUrl: string, HtmlParserClass: new (...args: any[]) => IFeedHtmlParser) {

        try {
            const pageArrayBuffer = (await axios.get(frontPageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'accept-encoding': '*'
                }
            })).data;

            const buffer = Buffer.from(pageArrayBuffer);
            const charset = this.getCharsetFromHtmlBuffer(buffer);

            const decodedHtml = iconv.decode(buffer, charset || "UTF-8");

            const htmlParserService = new HtmlParserClass();
            const feeds = htmlParserService.parseFrontPage(decodedHtml, new Date());

            for(const feed of feeds) {
                await this.feedRepository.createIfNotExists(feed);
            }

        } catch(error) {
            console.log("Could not save feed", error);
        }

    }

    /**
     * Detect the charset from the page response HTML buffer
     * @param buffer 
     * @returns 
     */
    private getCharsetFromHtmlBuffer(buffer: Buffer): string | null {

        const asciiChunk = buffer.subarray(0, 2048).toString('ascii');

        const metaTagMatch = asciiChunk.match(/<meta\s+[^>]*charset\s*=\s*["']?([^"'>\s]+)/i);
        return metaTagMatch ? metaTagMatch[1].toLowerCase() : null;
    }


}