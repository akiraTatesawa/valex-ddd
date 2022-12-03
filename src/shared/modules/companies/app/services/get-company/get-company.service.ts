import { CompanyRepository } from "@shared/modules/companies/app/ports/company-repository";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { Company } from "@shared/modules/companies/domain/company";
import { GetCompanyService } from "./get-company.interface";
import { GetCompanyServiceResponse } from "./get-company.response";
import { GetCompanyErrors } from "./get-company-errors/errors";

export class GetCompanyImpl implements GetCompanyService {
  private readonly companyRepo: CompanyRepository;

  constructor(companyRepo: CompanyRepository) {
    this.companyRepo = companyRepo;
  }

  public async getCompany(apiKey: string): Promise<GetCompanyServiceResponse> {
    const guardResult = Guard.againstNonUUID(apiKey, "Company API KEY");

    if (!guardResult.succeeded) {
      return GetCompanyErrors.InvalidApiKeyError.create(guardResult.message);
    }

    const company = await this.companyRepo.findUnique({ apiKey });

    if (!company) {
      return GetCompanyErrors.NotFoundError.create();
    }

    return Result.ok<Company>(company);
  }
}
