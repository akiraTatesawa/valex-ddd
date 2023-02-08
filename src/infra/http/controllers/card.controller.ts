import * as express from "express";
import { CardDTO } from "@app/dtos/card.dto";
import { CreateCardErrors } from "@app/errors/create-card-errors";
import { GetCompanyErrors } from "@app/services/get-company/get-company-errors/errors";
import { GetEmployeeErrors } from "@app/services/get-employee/get-employee-errors/errors";
import { ActivateCardUseCase } from "@app/use-cases/activate-card/activate-card";
import { BlockCardUseCase } from "@app/use-cases/block-card/block-card";
import { CreateCardUseCase } from "@app/use-cases/create-card/create-card";
import { UnblockCardUseCase } from "@app/use-cases/unblock-card/unblock-card";
import { BaseController } from "@core/infra/http/base-controller";
import { DomainErrors } from "@domain/errors/domain-error";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { ActivateCardErrors } from "@app/errors/activate-card-errors";
import { BlockCardErrors } from "@app/errors/block-card-errors";
import { UnblockCardErrors } from "@app/errors/unblock-card-errors";
import { RechargeCardUseCase } from "@app/use-cases/recharge-card/recharge-card";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { RechargeDTO } from "@app/dtos/recharge.dto";
import { GetCardBalanceUseCase } from "@app/use-cases/get-card-balance/get-card-balance";
import { BalanceDTO } from "@app/dtos/balance.dto";
import { CreateCardRequest } from "./requests/create-card-request";
import { ActivateCardRequest } from "./requests/activate-card-request";
import { BlockCardRequest, UnblockCardRequest } from "./requests/block-unblock-card-request";
import { RechargeCardRequest } from "./requests/recharge-card-request";

export class CardController extends BaseController {
  constructor(
    private readonly createCard: CreateCardUseCase,
    private readonly activateCard: ActivateCardUseCase,
    private readonly blockCard: BlockCardUseCase,
    private readonly unblockCard: UnblockCardUseCase,
    private readonly rechargeCard: RechargeCardUseCase,
    private readonly getBalanceUseCase: GetCardBalanceUseCase
  ) {
    super();
    this.create = this.create.bind(this);
    this.activate = this.activate.bind(this);
    this.block = this.block.bind(this);
    this.unblock = this.unblock.bind(this);
    this.recharge = this.recharge.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  public async create(req: express.Request, res: express.Response) {
    const { employeeId, type } = req.body as CreateCardRequest;
    const apiKey = req.headers["x-api-key"] as string;

    const result = await this.createCard.execute({
      apiKey,
      employeeId,
      type,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DomainErrors.InvalidPropsError:
        case GetCompanyErrors.InvalidApiKeyError:
        case GetEmployeeErrors.InvalidEmployeeIdError:
          return this.badRequest(res, error.getError().message);
        case GetEmployeeErrors.NotFoundError:
        case GetCompanyErrors.NotFoundError:
          return this.notFound(res, error.getError().message);
        case CreateCardErrors.EmployeeNotBelongToCompanyError:
          return this.unprocessableEntity(res, error.getError().message);
        case CreateCardErrors.ConflictCardType:
          return this.conflict(res, error.getError().message);
        default:
          return this.fail(res, error.getError().message);
      }
    }

    return this.created<CardDTO>(res, result.value.getValue());
  }

  public async activate(req: express.Request, res: express.Response) {
    const { cvv, password } = req.body as ActivateCardRequest;
    const { cardId } = req.params;

    const result = await this.activateCard.execute({
      cardId,
      cvv,
      password,
    });

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

  public async block(req: express.Request, res: express.Response) {
    const reqBody: BlockCardRequest = req.body;
    const { cardId } = req.params;

    const blockCardResult = await this.blockCard.execute({
      cardId,
      password: reqBody.password,
    });

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

  public async unblock(req: express.Request, res: express.Response) {
    const reqBody: UnblockCardRequest = req.body;
    const { cardId } = req.params;

    const unblockCardResult = await this.unblockCard.execute({
      cardId,
      password: reqBody.password,
    });

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

  public async recharge(req: express.Request, res: express.Response) {
    const reqBody: RechargeCardRequest = req.body;
    const { cardId } = req.params;
    const apiKey = req.headers["x-api-key"] as string;

    const rechargeCardResult = await this.rechargeCard.execute({
      cardId,
      amount: reqBody.amount,
      apiKey,
    });

    if (rechargeCardResult.isLeft()) {
      const rechargeCardError = rechargeCardResult.value;
      const errorMessage = rechargeCardResult.value.getError().message;

      switch (rechargeCardError.constructor) {
        case GetCompanyErrors.InvalidApiKeyError:
        case DomainErrors.InvalidPropsError:
          return this.badRequest(res, errorMessage);
        case CardUseCaseErrors.ExpiredCardError:
        case CardUseCaseErrors.InactiveCardError:
        case CardUseCaseErrors.VirtualCardError:
          return this.unprocessableEntity(res, errorMessage);
        case GetCompanyErrors.NotFoundError:
        case GetCardErrors.NotFoundError:
          return this.notFound(res, errorMessage);
        default:
          return this.fail(res, errorMessage);
      }
    }

    const rechargeDTO = rechargeCardResult.value.getValue();

    return this.created<RechargeDTO>(res, rechargeDTO);
  }

  public async getBalance(req: express.Request, res: express.Response) {
    const cardId = req.params.cardId as string;

    const getBalanceResult = await this.getBalanceUseCase.execute({ cardId });

    if (getBalanceResult.isLeft()) {
      const getBalanceError = getBalanceResult.value;
      const errorMessage = getBalanceResult.value.getError().message;

      switch (getBalanceError.constructor) {
        case CardUseCaseErrors.NotFoundError:
          return this.notFound(res, errorMessage);
        default:
          return this.fail(res, errorMessage);
      }
    }

    const balanceDTO = getBalanceResult.value.getValue();

    return this.ok<BalanceDTO>(res, balanceDTO);
  }
}
