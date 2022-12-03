import { CompanyRepository } from "@shared/modules/companies/app/ports/company-repository";
import { InMemoryCompanyRepository } from "@shared/modules/companies/infra/database/in-memory/in-memory-company-repository";
import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { CompanyFactory } from "@shared/modules/companies/factories/company-factory";
import { Company } from "@shared/modules/companies/domain/company";
import { Result } from "@core/logic/result";
import { randFullName, randUuid } from "@ngneat/falso";
import { GetCompanyErrors } from "@shared/modules/companies/app/services/get-company/get-company-errors/errors";
import { GetCompanyService } from "./get-company.interface";
import { GetCompanyImpl } from "./get-company.service";

describe("Get Company By API KEY Service", () => {
  let companyRepo: CompanyRepository;
  let sut: GetCompanyService;
  let company: Company;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    companyRepo = new InMemoryCompanyRepository(inMemoryDatabase);
    sut = new GetCompanyImpl(companyRepo);
    company = new CompanyFactory().generate();

    await companyRepo.save(company);
  });

  describe("Success", () => {
    it("Should be able to get a company by api key", async () => {
      const { apiKey } = company;

      const result = await sut.getCompany(apiKey);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Company);
      expect(result.value?._id).toEqual(company._id);
      expect(result.value?.apiKey).toEqual(company.apiKey);
    });
  });

  describe("Fail", () => {
    it("Should return an error it the API KEY format is invalid", async () => {
      const apiKey = randFullName();

      const result = await sut.getCompany(apiKey);

      expect(result).toBeInstanceOf(GetCompanyErrors.InvalidApiKeyError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Company API KEY must be a valid UUID");
    });

    it("Should return an error if the company does not exist", async () => {
      const apiKey = randUuid();

      const result = await sut.getCompany(apiKey);

      expect(result).toBeInstanceOf(GetCompanyErrors.NotFoundError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual("Company not found");
    });
  });
});
