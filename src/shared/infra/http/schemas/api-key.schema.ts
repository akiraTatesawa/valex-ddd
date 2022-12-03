import Joi from "joi";

export namespace HeaderSchemas {
  export const APIKeySchema = Joi.string().uuid().label("Company API KEY");
}
