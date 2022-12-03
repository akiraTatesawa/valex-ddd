import { ExpressRouter } from "@core/infra/http/router";
import { APIKeyValidator } from "@shared/infra/http/middlewares/api-key-validator";
import { SchemaValidator } from "@shared/infra/http/middlewares/schema-validator";
import { createCardController } from "../controllers/create-card";
import { CardSchemas } from "../schemas/card-schemas";

export class CardRouter extends ExpressRouter {
  protected configRouter(): void {
    // Create Voucher Card
    this._expressRouter.post(
      "/",
      APIKeyValidator.validateHeader,
      SchemaValidator.validateBody(CardSchemas.createCardSchema),
      createCardController.handle
    );
  }
}
