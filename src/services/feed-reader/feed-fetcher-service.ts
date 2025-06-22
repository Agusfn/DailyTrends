import axios from "axios";
import { INewsHtmlParser } from "./news-html-parser.interface";
import { Service } from "typedi";
import { FeedRepository } from "../../repositories/feed.repository";
import { ElMundoHtmlParserService } from "./el-mundo-html-parser.service";
import iconv from 'iconv-lite';


@Service()
export class FeedFetcherService {

    constructor(private feedRepository: FeedRepository) {

    }

    public async fetchNewsFromAllSites() {
        return Promise.all([
            this.fetchNewsFrontPage("https://www.elmundo.es/", ElMundoHtmlParserService)
        ]);
    }

    private async fetchNewsFrontPage(frontPageUrl: string, HtmlParserClass: new (...args: any[]) => INewsHtmlParser) {

        try {
            const pageHtml = (await axios.get(frontPageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'accept-encoding': '*'
                }
            })).data;

            const decodedHtml = iconv.decode(Buffer.from(pageHtml), 'iso-8859-15');

            const htmlParserService = new HtmlParserClass();
            const feeds = htmlParserService.parseFrontPage(decodedHtml, new Date());

            for(const feed of feeds) {
                await this.feedRepository.createIfNotExists(feed);
            }

        } catch(error) {
            console.log("Could not save feed", error);
        }

    }

}