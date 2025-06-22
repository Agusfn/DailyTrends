import 'reflect-metadata';
import 'dotenv/config'
import Container from 'typedi';
import { MongooseService } from './services/mongoose.service';
import { FeedRepository } from './repositories/feed.repository';
import { IFeedRepositoryToken } from './repositories/feed.repository.interface';
import { IHttpServer, IHttpServerToken } from './services/http-server.service.interface';
import { ExpressHttpServerService } from './services/express-http-server.service';



async function main() {

    console.log("Initializing application...");
    const mongooseService = Container.get(MongooseService);
    await mongooseService.connect(process.env.MONGO_CONNECTION_STRING!);

    // Bind services
    Container.set(IFeedRepositoryToken, Container.get(FeedRepository));
    Container.set(IHttpServerToken, Container.get(ExpressHttpServerService));

    // Bootstrap
    const server = Container.get<IHttpServer>(IHttpServerToken);
    server.start(Number(process.env.SERVER_PORT!));

}


main();