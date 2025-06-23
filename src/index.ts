import 'reflect-metadata';
import 'dotenv/config'
import Container from 'typedi';
import { MongooseService } from './services/mongoose.service';
import { IHttpServer, IHttpServerToken } from './services/http-server.service.interface';
import { ExpressHttpServerService } from './services/express-http-server.service';
import { NewsFeedSyncService } from './services/news-feed-sync-service';
import { newsSitesConfig } from './newsSitesConfig';

async function main() {

    // Bind services
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