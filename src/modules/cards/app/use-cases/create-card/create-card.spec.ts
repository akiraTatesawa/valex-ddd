import { Result } from "@core/logic/result";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { CompanyFactory } from "@shared/modules/companies/factories/company-factory";
import { EmployeeFactory } from "@shared/modules/employees/factories/employee-factory";
import { GetCompanyService } from "@shared/modules/companies/app/services/get-company/get-company.interface";
import { GetEmployeeService } from "@shared/modules/employees/app/services/get-employee/get-employee.interface";
import { CompanyRepository } from "@shared/modules/companies/app/ports/company-repository";
import { EmployeeRepository } from "app/ports/repositories/employee-repository";
import { InMemoryCompanyRepository } from "@shared/modules/companies/infra/database/in-memory/in-memory-company-repository";
import { InMemoryDatabase } from "@infra/data/in-memory/in-memory.database";
import { InMemoryEmployeeRepository } from "@shared/modules/employees/infra/database/in-memory/in-memory-employee-repository";
import { GetCompanyImpl } from "@shared/modules/companies/app/services/get-company/get-company.service";
import { GetEmployeeImpl } from "app/services/get-employee/get-employee.service";
import { CreateCardDTO } from "@modules/cards/dtos/create-card.dto";
import { InMemoryCardRepository } from "@modules/cards/infra/database/in-memory/in-memory-card-repository";
import { GetCompanyErrors } from "@shared/modules/companies/app/services/get-company/get-company-errors/errors";
import { randUuid, randFullName } from "@ngneat/falso";
import { GetEmployeeErrors } from "@shared/modules/employees/app/services/get-employee/get-employee-errors/errors";
import { DomainErrors } from "@domain/errors/domain-error";
import { VoucherType } from "@shared/domain/voucher-type";
import { Right, Left } from "@core/logic/either";
import { CreateCardImpl, CreateCardUseCase } from "./create-card";
import { CreateCardErrors } from "./create-card-errors/errors";

describe("Create Card Use Case", () => {
  const company = new CompanyFactory().generate();
  const employee = new EmployeeFactory().generate({ companyId: company._id });

  let companyRepo: CompanyRepository;
  let employeeRepo: EmployeeRepository;
  let getCompanyService: GetCompanyService;
  let getEmployeeService: GetEmployeeService;

  let cardRepo: CardRepository;
  let sut: CreateCardUseCase;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    companyRepo = new InMemoryCompanyRepository(inMemoryDatabase);
    employeeRepo = new InMemoryEmployeeRepository(inMemoryDatabase);

    await companyRepo.save(company);
    await employeeRepo.save(employee);

    getCompanyService = new GetCompanyImpl(companyRepo);
    getEmployeeService = new GetEmployeeImpl(employeeRepo);

    cardRepo = new InMemoryCardRepository(inMemoryDatabase);
    sut = new CreateCardImpl(getCompanyService, getEmployeeService, cardRepo);
  });

  describe("Success", () => {
    it("Should be able to create a voucher card", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: employee._id,
        type: "education",
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toHaveProperty("id");
      expect(result.value.getValue()).toHaveProperty("number");
      expect(result.value.getValue()).toHaveProperty("cardholderName");
      expect(result.value.getValue()).toHaveProperty("securityCode");
      expect(result.value.getValue()).toHaveProperty("expirationDate");
      expect(result.value.getValue()).toHaveProperty("type", createCardReq.type);
    });
  });

  describe("Fail", () => {
    it("Should return an error if company does not exist", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: randUuid(),
        employeeId: employee._id,
        type: "education",
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCompanyErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company not found");
    });

    it("Should return an error if the API KEY is not a valid UUID", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: randFullName(),
        employeeId: employee._id,
        type: "education",
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetCompanyErrors.InvalidApiKeyError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Company API KEY must be a valid UUID");
    });

    it("Should return an error if the employee does not exist", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: randUuid(),
        type: "education",
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetEmployeeErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee not found");
    });

    it("Should return an error if the employee ID is not a valid UUID", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: randFullName(),
        type: "education",
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetEmployeeErrors.InvalidEmployeeIdError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee ID must be a valid UUID");
    });

    it("Should return an error if the employee is not related to the company", async () => {
      const fakeEmployee = new EmployeeFactory().generate();
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: fakeEmployee._id,
        type: "education",
      };
      await employeeRepo.save(fakeEmployee);

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CreateCardErrors.EmployeeNotBelongToCompanyError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee does not belong to the company");
    });

    it("Should return an error if the employee already has a card with the same type", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: employee._id,
        type: "education",
      };
      await sut.execute(createCardReq);

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(CreateCardErrors.ConflictCardType);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        `The employee already has a '${createCardReq.type}' voucher card`
      );
    });

    it("Should return an error if the voucher type is not valid", async () => {
      const createCardReq: CreateCardDTO = {
        apiKey: company.apiKey,
        employeeId: employee._id,
        type: "invalid" as VoucherType,
      };

      const result = await sut.execute(createCardReq);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual(
        "Card Type can only assume the values: 'restaurant' | 'health' | 'transport' | 'groceries' | 'education'"
      );
    });
  });
});
