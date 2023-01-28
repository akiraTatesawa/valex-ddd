import Joi from "joi";
import { CreatePosPaymentRequest } from "../controllers/requests/create-pos-payment-request";

export namespace PaymentSchemas {
  export const buyPOSSchema = Joi.object<CreatePosPaymentRequest>({
    cardId: Joi.string().uuid().required(),
    cardPassword: Joi.string().length(4).required(),
    amount: Joi.number().integer().required(),
    businessId: Joi.string().uuid().required(),
  });
}
