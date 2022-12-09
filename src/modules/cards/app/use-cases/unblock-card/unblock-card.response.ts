import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { UnblockCardErrors } from "./unblock-card-errors/errors";

export type UnblockCardUseCaseResponse = Either<
  | CardUseCaseErrors.NotFoundError
  | CardUseCaseErrors.InactiveCardError
  | CardUseCaseErrors.WrongPasswordError
  | CardUseCaseErrors.ExpiredCardError
  | UnblockCardErrors.CardIsAlreadyUnblockedError,
  Result<null, null>
>;
