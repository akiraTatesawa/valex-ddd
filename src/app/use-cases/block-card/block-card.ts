import { UseCase } from "@core/app/use-case";
import { Result } from "@core/logic/result";
import { left, right } from "@core/logic/either";
import { BlockCardDTO } from "@app/dtos/block-unblock-card.dto";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { BlockCardResponse } from "./block-card.response";
import { BlockCardErrors } from "../../errors/block-card-errors";

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
