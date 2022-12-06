import { UseCase } from "@core/app/use-case";
import { BlockCardDTO } from "@modules/cards/dtos/block-card.dto";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { Result } from "@core/logic/result";
import { left, right } from "@core/logic/either";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { BlockCardResponse } from "./block-card.response";
import { BlockCardErrors } from "./block-card-errors/errors";

export interface BlockCardUseCase extends UseCase<BlockCardDTO, BlockCardResponse> {}

export class BlockCardImpl implements BlockCardUseCase {
  private readonly cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  public async execute(reqData: BlockCardDTO): Promise<BlockCardResponse> {
    const { cardId, password } = reqData;

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

    if (card.isBlocked) {
      return left(BlockCardErrors.CardIsAlreadyBlockedError.create());
    }

    card.block();

    await this.cardRepository.save(card);

    return right(Result.ok(null));
  }
}
