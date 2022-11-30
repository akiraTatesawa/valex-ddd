import { InMemoryDatabase } from "@infra/database/in-memory/in-memory.database";
import { Employee } from "@modules/employees/domain/employee";
import { randFullName, randEmail, randUuid } from "@ngneat/falso";
import { InMemoryEmployeeRepository } from "./in-memory-employee-repository";

describe("In Memory Employee Repository", () => {
  let employee: Employee;
  let sut: InMemoryEmployeeRepository;

  beforeEach(() => {
    const inMemoryDatabase = new InMemoryDatabase();
    sut = new InMemoryEmployeeRepository(inMemoryDatabase);

    employee = Employee.create({
      fullName: randFullName(),
      cpf: "12345678901",
      email: randEmail(),
      companyId: randUuid(),
    }).value!;
  });

  it("Should be able to save an employee into database", async () => {
    const result = await sut.save(employee);

    expect(result).toBeUndefined();
  });

  it("Should be able to find an employee by id", async () => {
    await sut.save(employee);

    const result = await sut.findUnique({ id: employee._id });

    expect(result).toBeInstanceOf(Employee);
  });

  it("Should be able to find an employee by cpf", async () => {
    await sut.save(employee);

    const result = await sut.findUnique({ cpf: employee.cpf.value });

    expect(result).toBeInstanceOf(Employee);
  });

  it("Should be able to find an employee by email", async () => {
    await sut.save(employee);

    const result = await sut.findUnique({ email: employee.email.value });

    expect(result).toBeInstanceOf(Employee);
  });

  it("Should return null if an employee cannot be found", async () => {
    const result = await sut.findUnique({ email: employee.email.value });

    expect(result).toBeNull();
  });
});
