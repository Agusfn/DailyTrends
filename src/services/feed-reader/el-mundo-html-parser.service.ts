import parse from "node-html-parser/dist/parse";
import { Service } from "typedi";
import { HTMLElement } from "node-html-parser";
import { IFeed } from "../../models/feed.interface";

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
export class ElMundoHtmlParserService {


    parseHtml(html: string) {

        const rootHtml = parse(html);

        const matchingElements = rootHtml.querySelectorAll('.ue-l-cg__unit');

        console.log("matchingElements.length", matchingElements.length)
        
        console.log(this.parseArticleElementToFeed(matchingElements[0]));
    }


    parseArticleElementToFeed(element: HTMLElement): IFeed {

        return {
            source: "",
            article_url: "",
            title: ""
        }


    }



}