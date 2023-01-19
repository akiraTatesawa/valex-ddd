import { UseCase } from "@core/app/use-case";

import { Result } from "@core/logic/result";
import { left, right } from "@core/logic/either";
import { ActivateCardDTO } from "@app/dtos/activate-card.dto";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { ActivateCardResponse } from "./activate-card.response";
import { ActivateCardErrors } from "../../errors/activate-card-errors";

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
