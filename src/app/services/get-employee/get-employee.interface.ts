import { GetEmployeeResponse } from "./get-employee.response";

export interface GetEmployeeService {
  getEmployee(id: string): Promise<GetEmployeeResponse>;
}
