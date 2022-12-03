import { Request, Response } from "express";
import httpStatus from "http-status";
import { APIError } from "./api-error";

export abstract class BaseController {
  constructor() {
    this.handle = this.handle.bind(this);
  }
  protected abstract handleImpl(req: Request, res: Response): Promise<any>;

  public async handle(req: Request, res: Response): Promise<void> {
    await this.handleImpl(req, res);
  }

  // Success Methods
  protected ok<DTO>(res: Response, dto?: DTO) {
    if (dto) {
      return res.status(httpStatus.OK).send(dto);
    }
    return res.sendStatus(httpStatus.OK);
  }

  protected created<DTO>(res: Response, dto?: DTO) {
    if (dto) {
      return res.status(httpStatus.CREATED).send(dto);
    }
    return res.sendStatus(httpStatus.CREATED);
  }

  // Error Methods
  protected badRequest(res: Response, message: string) {
    const error: APIError = {
      type: httpStatus[400],
      message,
    };

    return res.status(httpStatus.BAD_REQUEST).json(error);
  }

  protected notFound(res: Response, message: string) {
    const error: APIError = {
      type: httpStatus[404],
      message,
    };

    return res.status(httpStatus.NOT_FOUND).json(error);
  }

  protected conflict(res: Response, message: string) {
    const error: APIError = {
      type: httpStatus[409],
      message,
    };

    return res.status(httpStatus.CONFLICT).json(error);
  }

  protected unprocessableEntity(res: Response, message: string) {
    const error: APIError = {
      type: httpStatus[422],
      message,
    };

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json(error);
  }

  protected fail(res: Response, message: string) {
    const error: APIError = {
      type: httpStatus[409],
      message,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
