import { randFullName, randUuid } from "@ngneat/falso";
import { EmployeeRepository } from "@app/ports/repositories/employee-repository";
import { Employee } from "@domain/employee/employee";
import { Result } from "@core/logic/result";
import { Right, Left } from "@core/logic/either";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryEmployeeRepository } from "@infra/data/repositories/in-memory/in-memory-employee-repository";
import { EmployeeFactory } from "@tests/factories/employee-factory";
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

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Result);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Employee);
      expect(result.value.getValue()?._id).toEqual(id);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the provided id has an invalid format", async () => {
      const id = randFullName();

      const result = await sut.getEmployee(id);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetEmployeeErrors.InvalidEmployeeIdError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee ID must be a valid UUID");
    });

    it("Should return an error if the employee does not exist", async () => {
      const id = randUuid();

      const result = await sut.getEmployee(id);
      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(GetEmployeeErrors.NotFoundError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()?.message).toEqual("Employee not found");
    });
  });
});
