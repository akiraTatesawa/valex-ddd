import { BalanceDTO } from "@app/dtos/balance.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetBalanceService } from "@app/services/get-balance/get-balance.service";
import { UseCase } from "@core/app/use-case";
import { Either, left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";

interface GetBalanceRequest {
  cardId: string;
}

type GetBalanceResponse = Either<CardUseCaseErrors.NotFoundError, Result<BalanceDTO, null>>;

export class GetCardBalanceUseCase implements UseCase<GetBalanceRequest, GetBalanceResponse> {
  private readonly cardRepository: CardRepository;

  private readonly getBalanceService: GetBalanceService;

  constructor(cardRepository: CardRepository, getBalanceService: GetBalanceService) {
    this.cardRepository = cardRepository;
    this.getBalanceService = getBalanceService;
  }

  public async execute({ cardId }: GetBalanceRequest): Promise<GetBalanceResponse> {
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(CardUseCaseErrors.NotFoundError.create());
    }

    const rootCardId = card.originalCardId ?? card._id;

    const balance = await this.getBalanceService.getBalance(rootCardId);

    return right(Result.ok<BalanceDTO>(balance));
  }
}
