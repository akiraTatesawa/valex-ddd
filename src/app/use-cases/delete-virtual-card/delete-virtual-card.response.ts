import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { DeleteVirtualCardErrors } from "@app/errors/delete-virtual-card-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";

export type DeleteVirtualCardResponse = Either<
  | GetCardErrors.NotFoundError
  | DeleteVirtualCardErrors.NotVirtualError
  | CardUseCaseErrors.WrongPasswordError,
  Result<null, null>
>;
