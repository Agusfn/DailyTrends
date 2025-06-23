import parse from "node-html-parser/dist/parse";
import { Service } from "typedi";
import { HTMLElement } from "node-html-parser";
import { IFeed } from "../../models/feed.interface";
import { FeedSources } from "../../constants";
import { IFeedHtmlParser } from "./feed-html-parser.interface";

// articulo: .c
// link: .c_t > a (href)
// titulo: .c_t > a (innertext)
// subtitulo: .c_d (innertext)
// autor: .c_a_a (innertext) (puede haber varios)
// location: .c_a_l (innertext)
// video: .c_m video._re (src)
// img: .c_m img (src)
// media caption: .c_m figcaption (innertext)
// is_premium: existe .c_t span._pr

@Service()
export class ElPaisFeedHtmlParserService implements IFeedHtmlParser {


    public parseFrontPage(pageHtml: string, pageDate: Date): IFeed[] {

        const rootHtml = parse(pageHtml);

        const matchingElements = rootHtml.querySelectorAll('.c');
        
        return matchingElements
            .map(element => this.parseArticleElementToFeed(element, pageDate))
            .filter(i => i) as IFeed[];
    }


    private parseArticleElementToFeed(element: HTMLElement, pageDate: Date): IFeed | null {

        let authors: string | undefined = undefined;
        const authorElems = element.querySelectorAll(".c_a_a");
        if(authorElems.length > 0) {
            authors = authorElems.map(elem => elem.innerText).join(", ");
        }

        return {
            source: FeedSources.EL_PAIS,
            date: pageDate,
            article_url: element.querySelector(".c_t")?.querySelector("a")?.getAttribute("href") || "no",
            title: element.querySelector(".c_t")?.querySelector("a")?.innerText,
            subtitle: element.querySelector(".c_d")?.innerText,
            author_name: authors,
            location: element.querySelector(".c_a_l")?.innerText,
            main_image_url: element.querySelector(".c_m")?.querySelector("img")?.getAttribute("src"),
            main_video_url: element.querySelector(".c_m")?.querySelector("video._re")?.getAttribute("src"),
            media_caption: element.querySelector(".c_m")?.querySelector("figcaption")?.innerText,
            is_premium: element.querySelector("span._pr") ? true : false
        };

    }



}