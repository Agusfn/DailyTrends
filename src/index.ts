import 'reflect-metadata';
import Container from 'typedi';
import { MongooseService } from './services/mongoose.service';

console.log("hello world");


async function main() {

    const mongooseService = Container.get(MongooseService);
    await mongooseService.connect("");

}


main();