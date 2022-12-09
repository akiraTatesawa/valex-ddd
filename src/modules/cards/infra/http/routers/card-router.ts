import { ExpressRouter } from "@core/infra/http/router";
import { APIKeyValidator } from "@shared/infra/http/middlewares/api-key-validator";
import { SchemaValidator } from "@shared/infra/http/middlewares/schema-validator";
import { activateCardController } from "../controllers/activate-card";
import { blockCardController } from "../controllers/block-card";
import { createCardController } from "../controllers/create-card";
import { unblockCardController } from "../controllers/unblock-card";
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

    // Activate Voucher Card
    this._expressRouter.patch(
      "/:cardId/activate",
      SchemaValidator.validateBody(CardSchemas.activateCardSchema),
      activateCardController.handle
    );

    // Block Voucher Card
    this._expressRouter.patch(
      "/:cardId/block",
      SchemaValidator.validateBody(CardSchemas.blockUnblockCardSchema),
      blockCardController.handle
    );

    // Unblock Voucher Card
    this._expressRouter.patch(
      "/:cardId/unblock",
      SchemaValidator.validateBody(CardSchemas.blockUnblockCardSchema),
      unblockCardController.handle
    );
  }
}
