import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { CreateVirtualCardUseCase } from "@app/use-cases/create-virtual-card/create-virtual-card";
import { BaseController } from "@core/infra/http/base-controller";
import { DomainErrors } from "@domain/errors/domain-error";
import * as express from "express";
import { CreateVirtualCardRequest } from "./requests/virtual-card.request";

export class VirtualCardController extends BaseController {
  constructor(private readonly createVirtualCardUseCase: CreateVirtualCardUseCase) {
    super();

    this.createVirtualCard = this.createVirtualCard.bind(this);
  }

  public async createVirtualCard(req: express.Request, res: express.Response) {
    const cardId = req.params.cardId as string;
    const { password } = req.body as CreateVirtualCardRequest;

    const createVirtualCardResult = await this.createVirtualCardUseCase.execute({
      cardId,
      password,
    });

    if (createVirtualCardResult.isLeft()) {
      const virtualCardError = createVirtualCardResult.value;
      const errorMessage = virtualCardError.getError().message;

      switch (virtualCardError.constructor) {
        case DomainErrors.InvalidPropsError:
          return this.badRequest(res, errorMessage);

        case GetCardErrors.NotFoundError:
          return this.notFound(res, errorMessage);

        case CardUseCaseErrors.InactiveCardError:
          return this.unprocessableEntity(res, errorMessage);

        case CardUseCaseErrors.WrongPasswordError:
          return this.unauthorized(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const virtualCardDTO = createVirtualCardResult.value.getValue();

    return this.created(res, virtualCardDTO);
  }
}
