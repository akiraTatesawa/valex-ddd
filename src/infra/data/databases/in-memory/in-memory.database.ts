import { CardPersistence } from "@infra/data/persistence-model/card-persistence";
import { CompanyPersistence } from "@infra/data/persistence-model/company-persistence";
import { EmployeePersistence } from "@infra/data/persistence-model/employee-persistence";

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
