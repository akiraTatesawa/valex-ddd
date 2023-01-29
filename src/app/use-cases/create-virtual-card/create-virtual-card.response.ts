import { CardDTO } from "@app/dtos/card.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";

export type CreateVirtualCardResponse = Either<
  | DomainErrors.InvalidPropsError
  | GetCardErrors.NotFoundError
  | CardUseCaseErrors.InactiveCardError
  | CardUseCaseErrors.WrongPasswordError,
  Result<CardDTO, null>
>;
