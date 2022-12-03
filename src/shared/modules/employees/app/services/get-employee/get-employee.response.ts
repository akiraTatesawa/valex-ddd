import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Employee } from "@shared/modules/employees/domain/employee";
import { GetEmployeeErrors } from "./get-employee-errors/errors";

export type GetEmployeeResponse = Either<
  GetEmployeeErrors.InvalidEmployeeIdError | GetEmployeeErrors.NotFoundError,
  Result<Employee, null>
>;
