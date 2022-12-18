import { ExpressRouter } from "@core/infra/http/router";
import { cardController } from "../controllers/controller-factory";
import { APIKeyValidator } from "../middlewares/api-key-validator";
import { SchemaValidator } from "../middlewares/schema-validator";
import { CardSchemas } from "../schemas/card-schemas";

export class CardRouter extends ExpressRouter {
  protected configRouter(): void {
    // Create Voucher Card
    this._expressRouter.post(
      "/",
      APIKeyValidator.validateHeader,
      SchemaValidator.validateBody(CardSchemas.createCardSchema),
      cardController.create
    );

    // Activate Voucher Card
    this._expressRouter.patch(
      "/:cardId/activate",
      SchemaValidator.validateBody(CardSchemas.activateCardSchema),
      cardController.activate
    );

    // Block Voucher Card
    this._expressRouter.patch(
      "/:cardId/block",
      SchemaValidator.validateBody(CardSchemas.blockUnblockCardSchema),
      cardController.block
    );

    // Unblock Voucher Card
    this._expressRouter.patch(
      "/:cardId/unblock",
      SchemaValidator.validateBody(CardSchemas.blockUnblockCardSchema),
      cardController.unblock
    );
  }
}
