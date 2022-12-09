import { UseCase } from "@core/app/use-case";
import { right, left } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { BlockCardDTO, UnblockCardDTO } from "@modules/cards/dtos/block-unblock-card.dto";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { UnblockCardUseCaseResponse } from "./unblock-card.response";
import { UnblockCardErrors } from "./unblock-card-errors/errors";

export interface UnblockCardUseCase extends UseCase<UnblockCardDTO, UnblockCardUseCaseResponse> {}

export class UnblockCardImpl implements UnblockCardUseCase {
  private readonly cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  public async execute({ cardId, password }: BlockCardDTO): Promise<UnblockCardUseCaseResponse> {
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(CardUseCaseErrors.NotFoundError.create());
    }

    if (!card.isActive) {
      return left(CardUseCaseErrors.InactiveCardError.create());
    }

    if (!card.password?.compare(password)) {
      return left(CardUseCaseErrors.WrongPasswordError.create());
    }

    if (card.expirationDate.isExpired()) {
      return left(CardUseCaseErrors.ExpiredCardError.create());
    }

    if (!card.isBlocked) {
      return left(UnblockCardErrors.CardIsAlreadyUnblockedError.create());
    }

    card.unblock();

    await this.cardRepository.save(card);

    return right(Result.ok(null));
  }
}
