
export interface INewsPageFetcher {
    fetchPageHtml(url: string): Promise<string>;
}