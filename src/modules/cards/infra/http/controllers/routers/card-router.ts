import { ExpressRouter } from "@core/infra/http/router";
import { createCardController } from "../create-card";

export class CardRouter extends ExpressRouter {
  protected configRouter(): void {
    // Create Voucher Card
    this._expressRouter.post("/", createCardController.handle);
  }
}
