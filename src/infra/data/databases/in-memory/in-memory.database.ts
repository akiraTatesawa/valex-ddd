import { CardPersistence } from "@infra/data/persistence-model/card-persistence";
import { CompanyPersistence } from "@infra/data/persistence-model/company-persistence";
import { EmployeePersistence } from "@infra/data/persistence-model/employee-persistence";
import { RechargePersistence } from "@infra/data/persistence-model/recharge-persistence";

export class InMemoryDatabase {
  private _companies: CompanyPersistence[] = [];

  private _employees: EmployeePersistence[] = [];

  private _cards: CardPersistence[] = [];

  private _recharges: RechargePersistence[] = [];

  public get companies(): CompanyPersistence[] {
    return this._companies;
  }

  public get employees(): EmployeePersistence[] {
    return this._employees;
  }

  public get cards(): CardPersistence[] {
    return this._cards;
  }

  public get recharges(): RechargePersistence[] {
    return this._recharges;
  }
}

export const inMemoryDatabase = new InMemoryDatabase();
