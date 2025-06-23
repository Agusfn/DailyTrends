import 'reflect-metadata';
import 'dotenv/config'
import Container from 'typedi';
import { MongooseService } from './services/mongoose.service';
import { IHttpServer, IHttpServerToken } from './services/http-server.service.interface';
import { ExpressHttpServerService } from './services/express-http-server.service';
import { NewsFeedSyncService } from './services/news-feed-sync-service';
import { newsSitesConfig } from './newsSitesConfig';
import { IFeedRepositoryToken } from './repositories/feed.repository.interface';
import { FeedRepository } from './repositories/feed.repository';
import { INewsPageFetcherToken } from './services/news-page-fetcher.interface';
import { NewsPageFetcherService } from './services/news-page-fetcher-service';

async function main() {

    // Bind services
    Container.set(IFeedRepositoryToken, Container.get(FeedRepository));
    Container.set(INewsPageFetcherToken, Container.get(NewsPageFetcherService));
    Container.set(IHttpServerToken, Container.get(ExpressHttpServerService));

    // Bootstrap
    console.log("Initializing application...");

    const fetcherService = Container.get(NewsFeedSyncService);
    fetcherService.setNewsSitesConfig(newsSitesConfig);

    const mongooseService = Container.get(MongooseService);
    await mongooseService.connect(process.env.MONGO_CONNECTION_STRING!);

    const server = Container.get<IHttpServer>(IHttpServerToken);
    server.start(Number(process.env.SERVER_PORT!));
}


main();