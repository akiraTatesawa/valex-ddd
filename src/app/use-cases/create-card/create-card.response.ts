import { Either } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { Result } from "@core/logic/result";
import { CreateCardErrors } from "@app/errors/create-card-errors";
import { GetCompanyErrors } from "@app/services/get-company/get-company-errors/errors";
import { GetEmployeeErrors } from "@app/services/get-employee/get-employee-errors/errors";
import { CardDTO } from "@app/dtos/card.dto";

export type CreateCardResponse = Either<
  | CreateCardErrors.EmployeeNotBelongToCompanyError
  | CreateCardErrors.ConflictCardType
  | DomainErrors.InvalidPropsError
  | GetCompanyErrors.NotFoundError
  | GetEmployeeErrors.NotFoundError
  | GetCompanyErrors.InvalidApiKeyError
  | GetEmployeeErrors.InvalidEmployeeIdError,
  Result<CardDTO, null>
>;
