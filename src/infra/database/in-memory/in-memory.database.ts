import { CompanyPersistence } from "@modules/companies/infra/database/company-persistence.interface";
import { EmployeePersistence } from "@modules/employees/infra/database/employee-persistence.interface";

export class InMemoryDatabase {
  private _companies: CompanyPersistence[] = [];

  private _employees: EmployeePersistence[] = [];

  public get companies(): CompanyPersistence[] {
    return this._companies;
  }

  public get employees(): EmployeePersistence[] {
    return this._employees;
  }
}

export const inMemoryDatabase = new InMemoryDatabase();
