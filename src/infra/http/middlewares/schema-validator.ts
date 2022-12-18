import Joi from "joi";
import * as express from "express";
import httpStatus from "http-status";

export class SchemaValidator {
  public static validateBody(schema: Joi.ObjectSchema) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const validateOrError = schema.validate(req.body, {
        abortEarly: true,
        convert: false,
      });

      if (validateOrError.error) {
        const { error } = validateOrError;
        const messages = error.details.map((detailError) => detailError.message);

        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ type: httpStatus[400], message: messages.join(", ") });
      }

      return next();
    };
  }
}
