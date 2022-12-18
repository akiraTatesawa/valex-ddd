import { ActivateCardErrors } from "@app/errors/activate-card-errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";

export type ActivateCardResponse = Either<
  | CardUseCaseErrors.NotFoundError
  | ActivateCardErrors.CardIsAlreadyActiveError
  | ActivateCardErrors.InvalidPasswordError
  | CardUseCaseErrors.ExpiredCardError
  | CardUseCaseErrors.IncorrectCVVError,
  Result<null, null>
>;
