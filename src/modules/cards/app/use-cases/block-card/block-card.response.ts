import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CardUseCaseErrors } from "@modules/cards/app/card-shared-errors/card-shared-errors";
import { BlockCardErrors } from "./block-card-errors/errors";

export type BlockCardResponse = Either<
  | CardUseCaseErrors.WrongPasswordError
  | CardUseCaseErrors.NotFoundError
  | CardUseCaseErrors.ExpiredCardError
  | CardUseCaseErrors.InactiveCardError
  | BlockCardErrors.CardIsAlreadyBlockedError,
  Result<null, null>
>;
