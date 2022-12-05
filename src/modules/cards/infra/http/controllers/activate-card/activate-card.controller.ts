import { Request, Response } from "express";
import { BaseController } from "@core/infra/http/base-controller";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { ActivateCardUseCase } from "@modules/cards/app/use-cases/activate-card/activate-card";
import { ActivateCardErrors } from "@modules/cards/app/use-cases/activate-card/activate-card-errors/errors";
import { ActivateCardRequestBody, CardID } from "./request";

export class ActivateCardController extends BaseController {
  private readonly useCase: ActivateCardUseCase;

  constructor(useCase: ActivateCardUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async handleImpl(req: Request, res: Response): Promise<any> {
    const { cvv, password } = req.body as ActivateCardRequestBody;
    const cardId = req.params.cardId as CardID;

    const result = await this.useCase.execute({ cardId, cvv, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CardUseCaseErrors.ExpiredCardError:
        case ActivateCardErrors.InvalidPasswordError:
        case ActivateCardErrors.CardIsAlreadyActiveError:
          return this.badRequest(res, error.getError().message);
        case CardUseCaseErrors.NotFoundError:
          return this.notFound(res, error.getError().message);
        case CardUseCaseErrors.IncorrectCVVError:
          return this.unauthorized(res, error.getError().message);
        default:
          return this.fail(res, error.getError().message);
      }
    }

    return this.ok(res);
  }
}
