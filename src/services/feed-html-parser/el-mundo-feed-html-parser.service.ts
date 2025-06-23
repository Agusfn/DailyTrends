import parse from "node-html-parser/dist/parse";
import { Service } from "typedi";
import { HTMLElement } from "node-html-parser";
import { IFeed } from "../../models/feed.interface";
import { FeedSources } from "../../constants";
import { IFeedHtmlParser } from "./feed-html-parser.interface";

// ue-1-cg__unit:
// tag/categoria: ue-c-cover-content__kicker o ue-c-cover-content__aboveheadline
// titulo: ue-c-cover-content__headline
// url: ue-c-cover-content__link
// img: ue-c-cover-content__image
// video: ue-c-video-player-frame -> iframe dailymotion-player.src
// media caption: ue-c-cover-content__media-source
// autor: ue-c-cover-content__byline-name
// rol: ue-c-cover-content__byline-role
// location: ue-c-cover-content__byline-location
// opinion: existe --> ue-c-cover-content--is-opinion
// sponsor: ue-c-cover-content__sponsor-title
// is premium: ue-c-cover-content--is-premium


@Service()
export class ElMundoFeedHtmlParserService implements IFeedHtmlParser {


    public parseFrontPage(pageHtml: string, pageDate: Date): IFeed[] {

        const rootHtml = parse(pageHtml);

        const matchingElements = rootHtml.querySelectorAll('.ue-l-cg__unit');
        
        return matchingElements
            .map(element => this.parseArticleElementToFeed(element, pageDate))
            .filter(i => i) as IFeed[];
    }


    private parseArticleElementToFeed(element: HTMLElement, pageDate: Date): IFeed | null {

        const articleUrl = element.querySelector(".ue-c-cover-content__link")?.getAttribute("href");
        if(!articleUrl) {
            return null; // no article/invalid news element
        }

        const categoryElem = element.querySelector(".ue-c-cover-content__kicker") || element.querySelector(".ue-c-cover-content__aboveheadline");

        const authorNameElem = element.querySelector(".ue-c-cover-content__byline-name");
        if(authorNameElem) {
            authorNameElem.querySelector("span")?.remove();
        }

        return {
            source: FeedSources.EL_MUNDO,
            date: pageDate,
            article_url: articleUrl,
            title: element.querySelector(".ue-c-cover-content__headline")?.innerText,
            category: categoryElem?.innerText?.trim(),
            main_image_url: element.querySelector(".ue-c-cover-content__image")?.getAttribute("data-src"),
            media_caption: element.querySelector(".ue-c-cover-content__media-source")?.innerText,
            location: element.querySelector(".ue-c-cover-content__byline-location")?.innerText,
            author_name: authorNameElem?.innerText?.replace("\n", "")?.trim(),
            author_role: element.querySelector(".ue-c-cover-content__byline-role")?.innerText,
            is_opinion: element.querySelector(".ue-c-cover-content--is-opinion") ? true : false,
            is_premium: element.querySelector(".ue-c-cover-content--is-premium") ? true : false,
            sponsor: element.querySelector("ue-c-cover-content__sponsor-title")?.innerText
        }

    }



}