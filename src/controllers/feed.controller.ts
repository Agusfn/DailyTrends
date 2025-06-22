import { Service } from "typedi";
import { Request, Response } from "express";
import { Controller } from "./controller";
import { FeedFetcherService } from "../services/feed-reader/feed-fetcher-service";
import { FeedRepository } from "../repositories/feed.repository";


@Service()
export class FeedController extends Controller {
    
    constructor(
        private feedRepository: FeedRepository,
        private feedFetcher: FeedFetcherService
    ) {
        super();
    }

    protected registerRoutes() {
        this.router.post('', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.get('/today', this.getTodayFeeds.bind(this));
        this.router.get('/:id', this.get.bind(this));

    }

    async get(req: Request, res: Response) {
        res.json(await this.feedRepository.findById(req.params.id!));
    }

    async create(req: Request, res: Response) {
        res.json(await this.feedRepository.create(req.body));
    }

    async update(req: Request, res: Response) {
        res.json(await this.feedRepository.update(req.params.id!, req.body));
    }
    
    async delete(req: Request, res: Response) {
        res.json(await this.feedRepository.delete(req.params.id!));
    }

    async getTodayFeeds(req: Request, res: Response) {
        await this.feedFetcher.fetchNewsFromAllSites();
        res.json(await this.feedRepository.getOfCurrentDate());
    }

}