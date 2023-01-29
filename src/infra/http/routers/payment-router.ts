import { ExpressRouter } from "@core/infra/http/router";
import { paymentController } from "../controllers/controller-factory";
import { SchemaValidator } from "../middlewares/schema-validator";
import { PaymentSchemas } from "../schemas/payment-schemas";

export class PaymentRouter extends ExpressRouter {
  protected configRouter(): void {
    // Points of Sale Payment
    this._expressRouter.post(
      "/pos",
      SchemaValidator.validateBody(PaymentSchemas.buyPOSSchema),
      paymentController.buyPOS
    );

    // Online Payment
    this._expressRouter.post(
      "/online",
      SchemaValidator.validateBody(PaymentSchemas.buyOnlineSchema),
      paymentController.buyOnline
    );
  }
}
