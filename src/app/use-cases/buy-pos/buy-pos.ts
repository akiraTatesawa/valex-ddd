import { CreatePoSPaymentDTO } from "@app/dtos/create-payment.dto";
import { PaymentDTO } from "@app/dtos/payment.dto";
import { PaymentRepository } from "@app/ports/repositories/payment-repository";
import { left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Payment } from "@domain/payment/payment";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetBusinessService } from "@app/services/get-business/get-business.service";
import { UseCase } from "@core/app/use-case";
import { PaymentErrors } from "@app/errors/payment-errors";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { PaymentAppMapper } from "@app/mappers/payment-app-mapper";
import { BuyPosUseCaseResponse } from "./buy-pos.response";

export class BuyPosUseCase implements UseCase<CreatePoSPaymentDTO, BuyPosUseCaseResponse> {
  private readonly paymentRepository: PaymentRepository;

  private readonly getCardService: GetCardService;

  private readonly getBusinessService: GetBusinessService;

  private readonly getBalanceService: GetBalanceService;

  constructor(
    paymentRepository: PaymentRepository,
    getCardService: GetCardService,
    getBusinessService: GetBusinessService,
    getBalanceService: GetBalanceService
  ) {
    this.paymentRepository = paymentRepository;
    this.getCardService = getCardService;
    this.getBusinessService = getBusinessService;
    this.getBalanceService = getBalanceService;
  }

  public async execute(reqData: CreatePoSPaymentDTO): Promise<BuyPosUseCaseResponse> {
    const { amount, cardId, cardPassword, businessId } = reqData;

    const cardOrError = await this.getCardService.getCard(cardId);

    if (cardOrError.isLeft()) {
      return left(cardOrError.value);
    }

    const card = cardOrError.value.getValue();

    if (!card.isActive) {
      return left(CardUseCaseErrors.InactiveCardError.create());
    }
    if (card.expirationDate.isExpired()) {
      return left(CardUseCaseErrors.ExpiredCardError.create());
    }
    if (card.isBlocked) {
      return left(CardUseCaseErrors.BlockedCardError.create());
    }
    if (!card.password?.compare(cardPassword)) {
      return left(CardUseCaseErrors.WrongPasswordError.create());
    }

    const businessOrError = await this.getBusinessService.getBusiness(businessId);

    if (businessOrError.isLeft()) {
      return left(businessOrError.value);
    }

    const business = businessOrError.value.getValue();

    if (business.type !== card.type) {
      return left(PaymentErrors.IncompatibleTypesError.create());
    }

    const balanceDTO = await this.getBalanceService.getBalance(cardId);

    if (balanceDTO.balance - amount < 0) {
      return left(PaymentErrors.InsufficientBalance.create());
    }

    const paymentOrError = Payment.create({
      amount,
      businessId,
      cardId,
    });

    if (paymentOrError.isLeft()) {
      return left(paymentOrError.value);
    }

    const paymentEntity: Payment = paymentOrError.value.getValue();

    await this.paymentRepository.save(paymentEntity);

    const paymentDTO = PaymentAppMapper.toDTO(paymentEntity);

    return right(Result.ok<PaymentDTO>(paymentDTO));
  }
}
