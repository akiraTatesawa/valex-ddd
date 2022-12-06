import { Request, Response } from "express";

import { BaseController } from "@core/infra/http/base-controller";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { BlockCardUseCase } from "@modules/cards/app/use-cases/block-card/block-card";
import { BlockCardErrors } from "@modules/cards/app/use-cases/block-card/block-card-errors/errors";
import { BlockCardBody } from "./request";

export class BlockCardController extends BaseController {
  private readonly useCase: BlockCardUseCase;

  constructor(useCase: BlockCardUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async handleImpl(req: Request, res: Response): Promise<any> {
    const reqBody: BlockCardBody = req.body;
    const { cardId } = req.params;

    const blockCardResult = await this.useCase.execute({ cardId, password: reqBody.password });

    if (blockCardResult.isLeft()) {
      const blockCardError = blockCardResult.value;
      const errorMessage = blockCardError.getError().message;

      switch (blockCardError.constructor) {
        case CardUseCaseErrors.WrongPasswordError:
          return this.unauthorized(res, errorMessage);
        case CardUseCaseErrors.NotFoundError:
          return this.notFound(res, errorMessage);
        case CardUseCaseErrors.ExpiredCardError:
        case CardUseCaseErrors.InactiveCardError:
        case BlockCardErrors.CardIsAlreadyBlockedError:
          return this.unprocessableEntity(res, errorMessage);
        default:
          return this.fail(res, errorMessage);
      }
    }

    return this.ok(res);
  }
}
