import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Card } from "@domain/card/card";

export type GetCardResponse = Either<CardUseCaseErrors.NotFoundError, Result<Card, null>>;
