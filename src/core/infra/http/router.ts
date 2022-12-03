import * as express from "express";

export abstract class ExpressRouter {
  protected readonly _expressRouter: express.Router;

  constructor() {
    this._expressRouter = express.Router();

    this.configRouter();
  }

  public get router(): express.Router {
    return this._expressRouter;
  }

  protected abstract configRouter(): void;
}
