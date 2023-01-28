import { ExpressRouter } from "@core/infra/http/router";
import { CardRouter } from "./card-router";
import { PaymentRouter } from "./payment-router";

export class ServerRouter extends ExpressRouter {
  protected configRouter(): void {
    // Card Router
    this._expressRouter.use("/cards", new CardRouter().router);

    // Payment Router
    this._expressRouter.use("/payments", new PaymentRouter().router);
  }
}
