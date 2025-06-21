import mongoose from "mongoose";
import { Service } from "typedi";

@Service()
export class MongooseService {

    async connect(uri: string) {
        await mongoose.connect(uri);
    }

    disconnect() {
        
    }

}