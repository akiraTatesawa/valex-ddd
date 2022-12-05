import { UseCase } from "@core/app/use-case";
import { ActivateCardDTO } from "@modules/cards/dtos/activate-card.dto";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { Result } from "@core/logic/result";
import { left, right } from "@core/logic/either";
import { ActivateCardResponse } from "./activate-card.response";
import { CardUseCaseErrors } from "../../card-shared-errors/card-shared-errors";
import { ActivateCardErrors } from "./activate-card-errors/errors";

export interface ActivateCardUseCase extends UseCase<ActivateCardDTO, ActivateCardResponse> {}

export class ActivateCardImpl implements ActivateCardUseCase {
  private readonly cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  public async execute(reqData: ActivateCardDTO): Promise<ActivateCardResponse> {
    const { cardId, cvv, password } = reqData;

    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(CardUseCaseErrors.NotFoundError.create());
    }

    if (card.isActive) {
      return left(ActivateCardErrors.CardIsAlreadyActiveError.create());
    }

    if (card.expirationDate.isExpired()) {
      return left(CardUseCaseErrors.ExpiredCardError.create());
    }

    const isCvvCorrect = card.securityCode.compare(cvv);

    if (!isCvvCorrect) {
      return left(CardUseCaseErrors.IncorrectCVVError.create());
    }

    const domainCardActivationResult = card.activate(password);

    if (domainCardActivationResult.isLeft()) {
      const domainCardActivationError = domainCardActivationResult.value;

      return left(
        ActivateCardErrors.InvalidPasswordError.create(domainCardActivationError.getError().message)
      );
    }

    await this.cardRepository.save(card);

    return right(Result.ok(null));
  }
}
