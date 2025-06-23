import { Service } from "typedi";
import { FeedController } from "../controllers/feed.controller";
import { IHttpServer } from "./http-server.service.interface";
import express from 'express';

@Service()
export class ExpressHttpServerService implements IHttpServer {

    private app = express();

    constructor(
        private feedController: FeedController
    ) {
        this.app.use(express.json());
        
        this.app.use("/api/feed", this.feedController.router);
    }


    start(port: number) {
        return this.app.listen(port, () => {
            console.log("Server listening to port " + port + "...");
        });
    }

}