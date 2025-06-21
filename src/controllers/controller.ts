import { Router } from "express";

export abstract class Controller {

    public router: Router = Router();

    protected abstract registerRoutes(): any;

    constructor() {
        this.registerRoutes();
    }

}