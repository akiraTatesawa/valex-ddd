/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from "express";
import httpStatus from "http-status";

export class ErrorHandler {
  public static async handleExceptions(
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) {
    console.log(error);
    return res.status(500).json({ type: httpStatus[500], message: error.message });
  }
}
