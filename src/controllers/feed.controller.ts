import { Inject, Service } from "typedi";
import { IFeedRepository, IFeedRepositoryToken } from "../repositories/feed.repository.interface";
import { Request, Response } from "express";
import { Controller } from "./controller";
import { ElMundoHtmlParserService } from "../services/feed-reader/el-mundo-html-parser.service";
import axios from "axios";


@Service()
export class FeedController extends Controller {
    
    @Inject(IFeedRepositoryToken) private feedRepository!: IFeedRepository;

    constructor(private elmundoParser: ElMundoHtmlParserService) {
        super();
    }

    protected registerRoutes() {
        this.router.get('/:id', this.get.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.get('', this.getFeeds.bind(this));

    }

    async get(req: Request, res: Response) {

        const response = await axios.get("https://www.elmundo.es/");
        const html = response.data;

        this.elmundoParser.parseHtml(html);

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

    async getFeeds(req: Request, res: Response) {
        res.json(await this.feedRepository.findById("68570b3df6f0a3b422ffa219"));
    }

}