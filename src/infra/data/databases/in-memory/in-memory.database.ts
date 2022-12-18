import { CardPersistence } from "@modules/cards/infra/database/card-persistence";
import { CompanyPersistence } from "@shared/modules/companies/infra/database/company-persistence.interface";
import { EmployeePersistence } from "@shared/modules/employees/infra/database/employee-persistence.interface";

export class InMemoryDatabase {
  private _companies: CompanyPersistence[] = [];

  private _employees: EmployeePersistence[] = [];

  private _cards: CardPersistence[] = [];

  public get companies(): CompanyPersistence[] {
    return this._companies;
  }

  public get employees(): EmployeePersistence[] {
    return this._employees;
  }

  public get cards(): CardPersistence[] {
    return this._cards;
  }
}

export const inMemoryDatabase = new InMemoryDatabase();
