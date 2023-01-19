import Joi from "joi";
import { RechargeCardRequest } from "../controllers/requests/recharge-card-request";

export namespace RechargeSchemas {
  export const rechargeCardSchema = Joi.object<RechargeCardRequest>({
    amount: Joi.number().integer().greater(0).required(),
  });
}
