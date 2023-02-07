import { CreateRechargeDTO } from "@app/dtos/create-recharge.dto";
import { RechargeRepository } from "@app/ports/repositories/recharge-repository";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { UseCase } from "@core/app/use-case";
import { GetCompanyService } from "@app/services/get-company/get-company.interface";
import { left, right } from "@core/logic/either";
import { Card } from "@domain/card/card";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { Recharge } from "@domain/recharge/recharge";
import { RechargeDTO } from "@app/dtos/recharge.dto";
import { Result } from "@core/logic/result";
import { RechargeAppMapper } from "@app/mappers/recharge-app-mapper";
import { RechargeCardResponse } from "./recharge-card.response";

export interface RechargeCardUseCase extends UseCase<CreateRechargeDTO, RechargeCardResponse> {}

export class RechargeCardImpl implements RechargeCardUseCase {
  private readonly rechargeRepository: RechargeRepository;

  private readonly getCompanyService: GetCompanyService;

  private readonly getCardService: GetCardService;

  constructor(
    rechargeRepository: RechargeRepository,
    getCompanyService: GetCompanyService,
    getCardService: GetCardService
  ) {
    this.rechargeRepository = rechargeRepository;
    this.getCompanyService = getCompanyService;
    this.getCardService = getCardService;
  }

  public async execute(reqData: CreateRechargeDTO): Promise<RechargeCardResponse> {
    const { apiKey, cardId, amount } = reqData;

    const companyOrError = await this.getCompanyService.getCompany(apiKey);

    if (companyOrError.isLeft()) {
      const getCompanyError = companyOrError.value;

      return left(getCompanyError);
    }

    const cardOrError = await this.getCardService.getCard(cardId);

    if (cardOrError.isLeft()) {
      const getCardError = cardOrError.value;

      return left(getCardError);
    }

    const card: Card = cardOrError.value.getValue();

    if (card.isVirtual) {
      return left(CardUseCaseErrors.VirtualCardError.create("Cannot recharge a virtual card"));
    }

    if (!card.isActive) {
      return left(CardUseCaseErrors.InactiveCardError.create());
    }

    if (card.expirationDate.isExpired()) {
      return left(CardUseCaseErrors.ExpiredCardError.create());
    }

    const rechargeOrError = Recharge.create({ amount, cardId });

    if (rechargeOrError.isLeft()) {
      const rechargeDomainError = rechargeOrError.value;

      return left(rechargeDomainError);
    }

    const recharge: Recharge = rechargeOrError.value.getValue();

    await this.rechargeRepository.save(recharge);

    const rechargeDTO = RechargeAppMapper.toDTO(recharge);

    return right(Result.ok<RechargeDTO>(rechargeDTO));
  }
}
