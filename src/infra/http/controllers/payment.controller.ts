import * as express from "express";
import { PaymentDTO } from "@app/dtos/payment.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { GetBusinessErrors } from "@app/services/get-business/get-business-errors/errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { BuyPosUseCase } from "@app/use-cases/buy-pos/buy-pos";
import { BaseController } from "@core/infra/http/base-controller";
import { DomainErrors } from "@domain/errors/domain-error";
import { BuyOnlineUseCase } from "@app/use-cases/buy-online/buy-online";
import { CreatePosPaymentRequest } from "./requests/create-pos-payment-request";
import { CreateOnlinePaymentRequest } from "./requests/create-online-payment-request";

export class PaymentController extends BaseController {
  private readonly buyPOSUseCase: BuyPosUseCase;

  private readonly buyOnlineUseCase: BuyOnlineUseCase;

  constructor(buyPOSUseCase: BuyPosUseCase, buyOnlineUseCase: BuyOnlineUseCase) {
    super();
    this.buyPOSUseCase = buyPOSUseCase;
    this.buyOnlineUseCase = buyOnlineUseCase;

    this.buyPOS = this.buyPOS.bind(this);
    this.buyOnline = this.buyOnline.bind(this);
  }

  public async buyPOS(req: express.Request, res: express.Response) {
    const { amount, cardId, cardPassword, businessId } = req.body as CreatePosPaymentRequest;

    const posPaymentResult = await this.buyPOSUseCase.execute({
      cardId,
      cardPassword,
      amount,
      businessId,
    });

    if (posPaymentResult.isLeft()) {
      const error = posPaymentResult.value;
      const errorMessage = error.getError().message;

      switch (error.constructor) {
        case DomainErrors.InvalidPropsError:
          return this.badRequest(res, errorMessage);

        case CardUseCaseErrors.WrongPasswordError:
          return this.unauthorized(res, errorMessage);

        case GetCardErrors.NotFoundError:
        case GetBusinessErrors.NotFoundError:
          return this.notFound(res, errorMessage);

        case CardUseCaseErrors.InactiveCardError:
        case CardUseCaseErrors.ExpiredCardError:
        case CardUseCaseErrors.BlockedCardError:
        case PaymentErrors.IncompatibleTypesError:
        case PaymentErrors.InsufficientBalance:
        case CardUseCaseErrors.VirtualCardError:
          return this.unprocessableEntity(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const paymentDTO = posPaymentResult.value.getValue();

    return this.ok<PaymentDTO>(res, paymentDTO);
  }

  public async buyOnline(req: express.Request, res: express.Response) {
    const { amount, businessId, cardInfo } = req.body as CreateOnlinePaymentRequest;

    const onlinePaymentResult = await this.buyOnlineUseCase.execute({
      amount,
      businessId,
      cardInfo,
    });

    if (onlinePaymentResult.isLeft()) {
      const error = onlinePaymentResult.value;
      const errorMessage = error.getError().message;

      switch (error.constructor) {
        case DomainErrors.InvalidPropsError:
          return this.badRequest(res, errorMessage);

        case CardUseCaseErrors.IncorrectCVVError:
          return this.unauthorized(res, errorMessage);

        case GetCardErrors.NotFoundError:
        case GetBusinessErrors.NotFoundError:
          return this.notFound(res, errorMessage);

        case CardUseCaseErrors.InactiveCardError:
        case CardUseCaseErrors.ExpiredCardError:
        case CardUseCaseErrors.BlockedCardError:
        case PaymentErrors.IncompatibleTypesError:
        case PaymentErrors.InsufficientBalance:
          return this.unprocessableEntity(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const paymentDTO = onlinePaymentResult.value.getValue();

    return this.ok<PaymentDTO>(res, paymentDTO);
  }
}
