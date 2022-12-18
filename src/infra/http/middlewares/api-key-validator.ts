import * as express from "express";
import httpStatus from "http-status";
import { HeaderSchemas } from "../schemas/api-key.schema";

export class APIKeyValidator {
  public static validateHeader(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const apiKey = req.headers["x-api-key"];

    const validateOrError = HeaderSchemas.APIKeySchema.validate(apiKey);

    if (validateOrError.error) {
      const { error } = validateOrError;

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ type: httpStatus[400], message: error.message });
    }

    return next();
  }
}
