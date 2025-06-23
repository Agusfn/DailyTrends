import { INewsPageFetcher } from "./news-page-fetcher.interface";
import axios from "axios";
import iconv from 'iconv-lite';
import { Service } from "typedi";


@Service()
export class NewsPageFetcherService implements INewsPageFetcher {


    public async fetchPageHtml(url: string): Promise<string> {

        const pageArrayBuffer = (await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'accept-encoding': '*'
            }
        })).data;

        const buffer = Buffer.from(pageArrayBuffer);
        const charset = this.getCharsetFromHtmlBuffer(buffer);

        return iconv.decode(buffer, charset || "UTF-8");
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