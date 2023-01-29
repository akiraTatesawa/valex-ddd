import { CreateVirtualCardDTO } from "@app/dtos/create-virtual-card.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { CardAppMapper } from "@app/mappers/card-app-mapper";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { UseCase } from "@core/app/use-case";
import { left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CreateVirtualCardResponse } from "./create-virtual-card.response";

export class CreateVirtualCardUseCase
  implements UseCase<CreateVirtualCardDTO, CreateVirtualCardResponse>
{
  private readonly cardRepository: CardRepository;

  private readonly getCardService: GetCardService;

  constructor(cardRepository: CardRepository, getCardService: GetCardService) {
    this.cardRepository = cardRepository;
    this.getCardService = getCardService;
  }

  public async execute(reqData: CreateVirtualCardDTO): Promise<CreateVirtualCardResponse> {
    const { cardId, password } = reqData;

    const cardOrError = await this.getCardService.getCard(cardId);

    if (cardOrError.isLeft()) {
      const getCardError = cardOrError.value;
      return left(getCardError);
    }

    const card = cardOrError.value.getValue();

    if (!card.isActive) {
      return left(CardUseCaseErrors.InactiveCardError.create());
    }
    if (!card.password?.compare(password)) {
      return left(CardUseCaseErrors.WrongPasswordError.create());
    }

    const virtualCardOrError = card.generateVirtualCard();

    if (virtualCardOrError.isLeft()) {
      const virtualCardError = virtualCardOrError.value;
      return left(virtualCardError);
    }

    const virtualCard = virtualCardOrError.value.getValue();

    await this.cardRepository.save(virtualCard);

    const virtualCardDTO = CardAppMapper.toDTO(virtualCard);

    return right(Result.ok(virtualCardDTO));
  }
}
