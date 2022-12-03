import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";

import { randCompanyName } from "@ngneat/falso";
import { CompanyRepository } from "@shared/modules/companies/app/ports/company-repository";
import { Company } from "@shared/modules/companies/domain/company";
import { InMemoryCompanyRepository } from "./in-memory-company-repository";

describe("In Memory Company Repository", () => {
  let sut: CompanyRepository;

  beforeEach(() => {
    const inMemoryDatabase = new InMemoryDatabase();
    sut = new InMemoryCompanyRepository(inMemoryDatabase);
  });

  it("Should be able to save a company", async () => {
    const company = Company.create({
      name: randCompanyName(),
    }).value!;

    const result = await sut.save(company);

    expect(result).toBeUndefined();
  });

  it("Should be able to get a company by name", async () => {
    const company = Company.create({
      name: randCompanyName(),
    }).value!;
    await sut.save(company);

    const result = await sut.findUnique({ name: company.name.value });

    expect(result).toBeInstanceOf(Company);
    expect(result?.name.value).toEqual(company.name.value);
  });

  it("Should be able to get a company by ID", async () => {
    const company = Company.create({
      name: randCompanyName(),
    }).value!;
    await sut.save(company);

    const result = await sut.findUnique({ id: company._id });

    expect(result).toBeInstanceOf(Company);
    expect(result?._id).toEqual(company._id);
  });

  it("Should return null if the company is not registered", async () => {
    const company = Company.create({
      name: randCompanyName(),
    }).value!;

    const result = await sut.findUnique({ id: company._id });

    expect(result).toBeNull();
  });
});
