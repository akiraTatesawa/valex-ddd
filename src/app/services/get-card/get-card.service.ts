import { CardInfo } from "@app/dtos/create-payment.dto";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { right, left } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { CardExpirationDate } from "@domain/card/card-expiration-date";
import { GetCardErrors } from "./get-card-errors/errors";
import { GetCardResponse } from "./get-card.response";

export type GetCardByDetailsRequest = Omit<CardInfo, "cvv">;

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

  public async getCardByDetails(cardInfo: GetCardByDetailsRequest): Promise<GetCardResponse> {
    const { cardNumber, cardholderName, expirationDate } = cardInfo;

    const cardExpirationDateOrError = CardExpirationDate.createFromString(expirationDate);

    if (cardExpirationDateOrError.isLeft()) {
      const expirationDateError = cardExpirationDateOrError.value;

      return left(expirationDateError);
    }

    const cardExpirationDate = cardExpirationDateOrError.value.getValue();

    const card = await this.cardRepository.findByDetails({
      cardNumber,
      cardholderName,
      expirationDate: cardExpirationDate.getStringExpirationDate(),
    });

    if (!card) {
      return left(GetCardErrors.NotFoundError.create());
    }

    return right(Result.ok(card));
  }
}
