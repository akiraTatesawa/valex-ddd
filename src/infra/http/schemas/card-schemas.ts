import Joi from "joi";
import { CreateCardRequest } from "../controllers/requests/create-card-request";
import { ActivateCardRequest } from "../controllers/requests/activate-card-request";
import { BlockCardRequest } from "../controllers/requests/block-unblock-card-request";
import { CreateVirtualCardRequest } from "../controllers/requests/virtual-card.request";

export namespace CardSchemas {
  export const createCardSchema = Joi.object<CreateCardRequest>({
    type: Joi.string()
      .valid("restaurant", "health", "transport", "groceries", "education")
      .required(),
    employeeId: Joi.string().uuid().required(),
  });

  export const activateCardSchema = Joi.object<ActivateCardRequest>({
    cvv: Joi.string().required(),
    password: Joi.string().required(),
  });

  export const blockUnblockCardSchema = Joi.object<BlockCardRequest>({
    password: Joi.string().required(),
  });

  export const createVirtualCardSchema = Joi.object<CreateVirtualCardRequest>({
    password: Joi.string().length(4).required(),
  });

  export const deleteVirtualCardSchema = createVirtualCardSchema;
}
