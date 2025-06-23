
export const INewsPageFetcherToken = "INewsPageFetcher";

export interface INewsPageFetcher {
    fetchPageHtml(url: string): Promise<string>;
}