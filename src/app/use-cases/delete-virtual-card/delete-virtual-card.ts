import { DeleteVirtualCardDTO } from "@app/dtos/delete-virtual-card.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { DeleteVirtualCardErrors } from "@app/errors/delete-virtual-card-errors";
import { CardRepository } from "@app/ports/repositories/card-repository";
import { GetCardService } from "@app/services/get-card/get-card.service";
import { UseCase } from "@core/app/use-case";
import { left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DeleteVirtualCardResponse } from "./delete-virtual-card.response";

export class DeleteVirtualCardUseCase
  implements UseCase<DeleteVirtualCardDTO, DeleteVirtualCardResponse>
{
  private readonly cardRepository: CardRepository;

  private readonly getCardService: GetCardService;

  constructor(cardRepository: CardRepository, getCardService: GetCardService) {
    this.cardRepository = cardRepository;
    this.getCardService = getCardService;
  }

  public async execute(reqData: DeleteVirtualCardDTO): Promise<DeleteVirtualCardResponse> {
    const { cardId, password } = reqData;

    const cardOrError = await this.getCardService.getCard(cardId);

    if (cardOrError.isLeft()) {
      const getCardError = cardOrError.value;
      return left(getCardError);
    }

    const card = cardOrError.value.getValue();

    if (!card.isVirtual) {
      return left(DeleteVirtualCardErrors.NotVirtualError.create());
    }

    if (!card.password?.compare(password)) {
      return left(CardUseCaseErrors.WrongPasswordError.create());
    }

    await this.cardRepository.delete(cardId);

    return right(Result.ok<null>(null));
  }
}
