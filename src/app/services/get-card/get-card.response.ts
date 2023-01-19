import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Card } from "@domain/card/card";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";

export type GetCardResponse = Either<GetCardErrors.NotFoundError, Result<Card, null>>;
