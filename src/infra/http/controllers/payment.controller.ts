import * as express from "express";
import { PaymentDTO } from "@app/dtos/payment.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { GetBusinessErrors } from "@app/services/get-business/get-business-errors/errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { BuyPosUseCase } from "@app/use-cases/buy-pos/buy-pos";
import { BaseController } from "@core/infra/http/base-controller";
import { DomainErrors } from "@domain/errors/domain-error";
import { CreatePosPaymentRequest } from "./requests/create-pos-payment-request";

export class PaymentController extends BaseController {
  private readonly buyPOSUseCase: BuyPosUseCase;

  constructor(buyPOSUseCase: BuyPosUseCase) {
    super();
    this.buyPOSUseCase = buyPOSUseCase;

    this.buyPOS = this.buyPOS.bind(this);
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
          return this.unprocessableEntity(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const paymentDTO = posPaymentResult.value.getValue();

    return this.ok<PaymentDTO>(res, paymentDTO);
  }
}
