import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { UnblockCardErrors } from "../../errors/unblock-card-errors";

export type UnblockCardUseCaseResponse = Either<
  | CardUseCaseErrors.NotFoundError
  | CardUseCaseErrors.InactiveCardError
  | CardUseCaseErrors.WrongPasswordError
  | CardUseCaseErrors.ExpiredCardError
  | UnblockCardErrors.CardIsAlreadyUnblockedError,
  Result<null, null>
>;
