import Joi from "joi";
import { CreateCardBody } from "../controllers/create-card/request";
import { ActivateCardRequestBody } from "../controllers/activate-card/request";

export namespace CardSchemas {
  export const createCardSchema = Joi.object<CreateCardBody>({
    type: Joi.string()
      .valid("restaurant", "health", "transport", "groceries", "education")
      .required(),
    employeeId: Joi.string().uuid().required(),
  });

  export const activateCardSchema = Joi.object<ActivateCardRequestBody>({
    cvv: Joi.string().required(),
    password: Joi.string().required(),
  });
}
