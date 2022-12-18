import { ExpressRouter } from "@core/infra/http/router";
import { CardRouter } from "./card-router";

export class ServerRouter extends ExpressRouter {
  protected configRouter(): void {
    // Card Router
    this._expressRouter.use("/cards", new CardRouter().router);
  }
}
