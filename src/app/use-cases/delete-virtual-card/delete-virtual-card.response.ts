import { DeleteVirtualCardErrors } from "@app/errors/delete-virtual-card-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";

export type DeleteVirtualCardResponse = Either<
  GetCardErrors.NotFoundError | DeleteVirtualCardErrors.NotVirtualError,
  Result<null, null>
>;
