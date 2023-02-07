import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { DeleteVirtualCardErrors } from "@app/errors/delete-virtual-card-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { CreateVirtualCardUseCase } from "@app/use-cases/create-virtual-card/create-virtual-card";
import { DeleteVirtualCardUseCase } from "@app/use-cases/delete-virtual-card/delete-virtual-card";
import { BaseController } from "@core/infra/http/base-controller";
import { DomainErrors } from "@domain/errors/domain-error";
import * as express from "express";
import {
  CreateVirtualCardRequest,
  DeleteVirtualCardRequest,
} from "./requests/virtual-card.request";

export class VirtualCardController extends BaseController {
  constructor(
    private readonly createVirtualCardUseCase: CreateVirtualCardUseCase,
    private readonly deleteVirtualCardUseCase: DeleteVirtualCardUseCase
  ) {
    super();

    this.createVirtualCard = this.createVirtualCard.bind(this);
    this.deleteVirtualCard = this.deleteVirtualCard.bind(this);
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

  public async deleteVirtualCard(req: express.Request, res: express.Response) {
    const cardId = req.params.cardId as string;
    const { password } = req.body as DeleteVirtualCardRequest;

    const deleteVirtualCardResult = await this.deleteVirtualCardUseCase.execute({
      cardId,
      password,
    });

    if (deleteVirtualCardResult.isLeft()) {
      const deleteVirtualCardError = deleteVirtualCardResult.value;
      const errorMessage = deleteVirtualCardError.getError().message;

      switch (deleteVirtualCardError.constructor) {
        case CardUseCaseErrors.WrongPasswordError:
          return this.unauthorized(res, errorMessage);

        case GetCardErrors.NotFoundError:
          return this.notFound(res, errorMessage);

        case DeleteVirtualCardErrors.NotVirtualError:
          return this.unprocessableEntity(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    return this.ok(res);
  }
}
