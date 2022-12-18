import { BlockCardErrors } from "@app/errors/block-card-errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";

export type BlockCardResponse = Either<
  | CardUseCaseErrors.WrongPasswordError
  | CardUseCaseErrors.NotFoundError
  | CardUseCaseErrors.ExpiredCardError
  | CardUseCaseErrors.InactiveCardError
  | BlockCardErrors.CardIsAlreadyBlockedError,
  Result<null, null>
>;
