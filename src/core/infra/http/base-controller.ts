import * as express from "express";
import httpStatus from "http-status";
import { APIError } from "./api-error";

export abstract class BaseController {
  // Success Methods
  protected ok<DTO>(res: express.Response, dto?: DTO) {
    if (dto) {
      return res.status(httpStatus.OK).send(dto);
    }
    return res.sendStatus(httpStatus.OK);
  }

  protected created<DTO>(res: express.Response, dto?: DTO) {
    if (dto) {
      return res.status(httpStatus.CREATED).send(dto);
    }
    return res.sendStatus(httpStatus.CREATED);
  }

  // Error Methods
  protected badRequest(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[400],
      message,
    };

    return res.status(httpStatus.BAD_REQUEST).json(error);
  }

  protected unauthorized(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[401],
      message,
    };

    return res.status(httpStatus.UNAUTHORIZED).json(error);
  }

  protected notFound(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[404],
      message,
    };

    return res.status(httpStatus.NOT_FOUND).json(error);
  }

  protected conflict(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[409],
      message,
    };

    return res.status(httpStatus.CONFLICT).json(error);
  }

  protected unprocessableEntity(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[422],
      message,
    };

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json(error);
  }

  protected fail(res: express.Response, message: string) {
    const error: APIError = {
      type: httpStatus[409],
      message,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
