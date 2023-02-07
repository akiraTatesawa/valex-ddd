import Joi from "joi";

export namespace HeaderSchemas {
  export const APIKeySchema = Joi.string()
    .uuid()
    .message("Company API KEY must be a valid UUID")
    .label("Company API KEY");
}
