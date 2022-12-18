import { EmployeeRepository } from "@app/ports/repositories/employee-repository";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { Employee } from "@domain/employee/employee";
import { left, right } from "@core/logic/either";
import { GetEmployeeService } from "./get-employee.interface";
import { GetEmployeeResponse } from "./get-employee.response";
import { GetEmployeeErrors } from "./get-employee-errors/errors";

export class GetEmployeeImpl implements GetEmployeeService {
  private readonly employeeRepo: EmployeeRepository;

  constructor(employeeRepo: EmployeeRepository) {
    this.employeeRepo = employeeRepo;
  }

  public async getEmployee(id: string): Promise<GetEmployeeResponse> {
    const guardResult = Guard.againstNonUUID(id, "Employee ID");

    if (!guardResult.succeeded) {
      return left(GetEmployeeErrors.InvalidEmployeeIdError.create(guardResult.message));
    }

    const employee = await this.employeeRepo.findUnique({ id });

    if (!employee) {
      return left(GetEmployeeErrors.NotFoundError.create());
    }

    return right(Result.ok<Employee>(employee));
  }
}
