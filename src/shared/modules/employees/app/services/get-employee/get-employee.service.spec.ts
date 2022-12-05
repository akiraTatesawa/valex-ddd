import { randFullName, randUuid } from "@ngneat/falso";
import { EmployeeRepository } from "@shared/modules/employees/app/ports/employee-repository";
import { Employee } from "@shared/modules/employees/domain/employee";
import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { InMemoryEmployeeRepository } from "@shared/modules/employees/infra/database/in-memory/in-memory-employee-repository";
import { EmployeeFactory } from "@shared/modules/employees/factories/employee-factory";
import { Result } from "@core/logic/result";
import { GetEmployeeService } from "./get-employee.interface";
import { GetEmployeeImpl } from "./get-employee.service";
import { GetEmployeeErrors } from "./get-employee-errors/errors";

describe("Get Employee By ID Service", () => {
  let employee: Employee;
  let employeeRepo: EmployeeRepository;
  let sut: GetEmployeeService;

  beforeEach(async () => {
    const inMemoryDatabase = new InMemoryDatabase();
    employeeRepo = new InMemoryEmployeeRepository(inMemoryDatabase);

    sut = new GetEmployeeImpl(employeeRepo);

    employee = new EmployeeFactory().generate();
    await employeeRepo.save(employee);
  });

  describe("Success", () => {
    it("Should be able to get an employee by id", async () => {
      const id = employee._id;

      const result = await sut.getEmployee(id);

      expect(result).toBeInstanceOf(Result);
      expect(result.isSuccess).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.value).toBeInstanceOf(Employee);
      expect(result.value?._id).toEqual(id);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided id has an invalid format", async () => {
      const id = randFullName();

      const result = await sut.getEmployee(id);

      expect(result).toBeInstanceOf(GetEmployeeErrors.InvalidEmployeeIdError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee ID must be a valid UUID");
    });

    it("Should return an error if the employee does not exist", async () => {
      const id = randUuid();

      const result = await sut.getEmployee(id);

      expect(result).toBeInstanceOf(GetEmployeeErrors.NotFoundError);
      expect(result.isFailure).toEqual(true);
      expect(result.value).toBeNull();
      expect(result.error?.message).toEqual("Employee not found");
    });
  });
});