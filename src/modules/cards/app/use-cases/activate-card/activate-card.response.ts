import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { CardUseCaseErrors } from "../../card-shared-errors/card-shared-errors";
import { ActivateCardErrors } from "./activate-card-errors/errors";

export type ActivateCardResponse = Either<
  | CardUseCaseErrors.NotFoundError
  | ActivateCardErrors.CardIsAlreadyActiveError
  | CardUseCaseErrors.ExpiredCardError
  | CardUseCaseErrors.IncorrectCVVError,
  Result<null, null>
>;
