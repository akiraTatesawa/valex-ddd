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
  protected badRequest(res: Response, error?: APIError) {
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  protected notFound(res: Response, error?: APIError) {
    if (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  protected conflict(res: Response, error?: APIError) {
    if (error) {
      return res.status(httpStatus.CONFLICT).json(error);
    }
    return res.sendStatus(httpStatus.CONFLICT);
  }
}
