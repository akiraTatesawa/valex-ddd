import { Request, Response } from "express";

import { BaseController } from "@core/infra/http/base-controller";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { UnblockCardUseCase } from "@modules/cards/app/use-cases/unblock-card/unblock-card";
import { UnblockCardErrors } from "@modules/cards/app/use-cases/unblock-card/unblock-card-errors/errors";
import { UnblockCardRequestBody } from "./request";

export class UnblockCardController extends BaseController {
  private readonly useCase: UnblockCardUseCase;

  constructor(useCase: UnblockCardUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async handleImpl(req: Request, res: Response): Promise<any> {
    const reqBody: UnblockCardRequestBody = req.body;
    const { cardId } = req.params;

    const unblockCardResult = await this.useCase.execute({ cardId, password: reqBody.password });

    if (unblockCardResult.isLeft()) {
      const unblockCardError = unblockCardResult.value;
      const errorMessage = unblockCardError.getError().message;

      switch (unblockCardError.constructor) {
        case CardUseCaseErrors.WrongPasswordError:
          return this.unauthorized(res, errorMessage);
        case CardUseCaseErrors.NotFoundError:
          return this.notFound(res, errorMessage);
        case CardUseCaseErrors.ExpiredCardError:
        case CardUseCaseErrors.InactiveCardError:
        case UnblockCardErrors.CardIsAlreadyUnblockedError:
          return this.unprocessableEntity(res, errorMessage);
        default:
          return this.fail(res, errorMessage);
      }
    }

    return this.ok(res);
  }
}
