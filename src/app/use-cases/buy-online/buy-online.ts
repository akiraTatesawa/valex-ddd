import { CreateOnlinePaymentDTO } from "@app/dtos/create-payment.dto";
import { PaymentDTO } from "@app/dtos/payment.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { PaymentAppMapper } from "@app/mappers/payment-app-mapper";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { GetBusinessService } from "@app/services/get-business/get-business.service";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { UseCase } from "@core/app/use-case";
import { left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Payment } from "@domain/payment/payment";
import { BuyOnlineResponse } from "./buy-online.response";

export class BuyOnlineUseCase implements UseCase<CreateOnlinePaymentDTO, BuyOnlineResponse> {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly getCardService: GetCardService,
    private readonly getBusinessService: GetBusinessService,
    private readonly getBalanceService: GetBalanceService
  ) {}

  public async execute(reqData: CreateOnlinePaymentDTO): Promise<BuyOnlineResponse> {
    const { cardInfo, amount, businessId } = reqData;
    const { cardNumber, cardholderName, cvv, expirationDate } = cardInfo;

    const cardOrError = await this.getCardService.getCardByDetails({
      cardholderName,
      cardNumber,
      expirationDate,
    });

    if (cardOrError.isLeft()) {
      const getCardError = cardOrError.value;
      return left(getCardError);
    }

    const card = cardOrError.value.getValue();
    const cardId = card.originalCardId ?? card._id;

    if (!card.isActive) {
      return left(CardUseCaseErrors.InactiveCardError.create());
    }
    if (card.expirationDate.isExpired()) {
      return left(CardUseCaseErrors.ExpiredCardError.create());
    }
    if (card.isBlocked) {
      return left(CardUseCaseErrors.BlockedCardError.create());
    }
    if (!card.securityCode.compare(cvv)) {
      return left(CardUseCaseErrors.IncorrectCVVError.create());
    }

    const businessOrError = await this.getBusinessService.getBusiness(businessId);

    if (businessOrError.isLeft()) {
      const getBusinessError = businessOrError.value;
      return left(getBusinessError);
    }

    const business = businessOrError.value.getValue();

    if (business.type !== card.type) {
      return left(PaymentErrors.IncompatibleTypesError.create());
    }

    const onlinePaymentOrError = Payment.create({
      cardId,
      businessId,
      amount,
    });

    if (onlinePaymentOrError.isLeft()) {
      const paymentEntityError = onlinePaymentOrError.value;
      return left(paymentEntityError);
    }

    const balanceDTO = await this.getBalanceService.getBalance(cardId);

    if (balanceDTO.balance - amount < 0) {
      return left(PaymentErrors.InsufficientBalance.create());
    }

    const onlinePayment = onlinePaymentOrError.value.getValue();

    await this.paymentRepository.save(onlinePayment);

    const paymentDTO = PaymentAppMapper.toDTO(onlinePayment);

    return right(Result.ok<PaymentDTO>(paymentDTO));
  }
}
