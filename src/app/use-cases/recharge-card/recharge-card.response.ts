import { RechargeDTO } from "@app/dtos/recharge.dto";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { GetCompanyErrors } from "@app/services/get-company/get-company-errors/errors";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { DomainErrors } from "@domain/errors/domain-error";

export type RechargeCardResponse = Either<
  | GetCompanyErrors.InvalidApiKeyError
  | GetCompanyErrors.NotFoundError
  | GetCardErrors.NotFoundError
  | CardUseCaseErrors.InactiveCardError
  | CardUseCaseErrors.ExpiredCardError
  | DomainErrors.InvalidPropsError,
  Result<RechargeDTO, null>
>;
