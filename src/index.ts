import 'reflect-metadata';
import 'dotenv/config'
import Container from 'typedi';
import { MongooseService } from './services/mongoose.service';
import { FeedRepository } from './repositories/feed.repository';
import { IFeedRepository, IFeedRepositoryToken } from './repositories/feed.repository.interface';



async function main() {

    console.log("Initializing application...");
    const mongooseService = Container.get(MongooseService);
    await mongooseService.connect(process.env.MONGO_CONNECTION_STRING!);

    Container.set(IFeedRepositoryToken, Container.get(FeedRepository))

    const repo = Container.get<IFeedRepository>(IFeedRepositoryToken);
    const feed = await repo.create({
        source: "elpais.com",
        article_url: "https://elpais.com/espana/2025-06-21/el-trio-koldoabaloscerdan-se-rompe-entre-reproches-de-grave-corrupcion.html",
        title: "El trío Koldo/Ábalos/Cerdán se rompe entre reproches de grave corrupción"
    });

    console.log("Feed created!");
    console.log("feed", feed)

}


main();