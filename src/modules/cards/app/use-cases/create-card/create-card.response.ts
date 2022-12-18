import { Either } from "@core/logic/either";
import { CardDTO } from "@modules/cards/dtos/card.dto";
import { DomainErrors } from "@domain/errors/domain-error";
import { Result } from "@core/logic/result";
import { GetCompanyErrors } from "@shared/modules/companies/app/services/get-company/get-company-errors/errors";
import { GetEmployeeErrors } from "@shared/modules/employees/app/services/get-employee/get-employee-errors/errors";
import { CreateCardErrors } from "./create-card-errors/errors";

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
