import { CardRepository } from "@app/ports/repositories/card-repository";
import { right, left } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { GetCardErrors } from "./get-card-errors/errors";
import { GetCardResponse } from "./get-card.response";

export class GetCardService {
  private readonly cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  public async getCard(cardId: string): Promise<GetCardResponse> {
    const guardResult = Guard.againstNonUUID(cardId, "Card ID");

    if (!guardResult.succeeded) {
      return left(GetCardErrors.InvalidCardIdError.create(guardResult.message));
    }

    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(GetCardErrors.NotFoundError.create());
    }

    return right(Result.ok(card));
  }
}
