import Joi from "joi";
import { CardInfo } from "@app/dtos/create-payment.dto";
import { CreatePosPaymentRequest } from "../controllers/requests/create-pos-payment-request";
import { CreateOnlinePaymentRequest } from "../controllers/requests/create-online-payment-request";

export namespace PaymentSchemas {
  export const buyPOSSchema = Joi.object<CreatePosPaymentRequest>({
    cardId: Joi.string().uuid().required(),
    cardPassword: Joi.string().length(4).required(),
    amount: Joi.number().integer().required(),
    businessId: Joi.string().uuid().required(),
  });

  export const buyOnlineSchema = Joi.object<CreateOnlinePaymentRequest>({
    amount: Joi.number().integer().required(),
    businessId: Joi.string().uuid().required(),
    cardInfo: Joi.object<CardInfo>({
      cardholderName: Joi.string().required(),
      cardNumber: Joi.string()
        .regex(/^[0-9]{16}$/)
        .required(),
      cvv: Joi.string()
        .regex(/^[0-9]{3}$/)
        .required(),
      expirationDate: Joi.string()
        .regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
        .required(),
    }),
  });
}
