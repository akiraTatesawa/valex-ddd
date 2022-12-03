import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Company } from "@shared/modules/companies/domain/company";
import { GetCompanyErrors } from "./get-company-errors/errors";

export type GetCompanyServiceResponse = Either<
  GetCompanyErrors.NotFoundError | GetCompanyErrors.InvalidApiKeyError,
  Result<Company, null>
>;
