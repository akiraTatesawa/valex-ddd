import { CompanyPersistence } from "@modules/companies/infra/database/company-persistence.interface";

export class InMemoryDatabase {
  private _companies: CompanyPersistence[] = [];

  public get companies(): CompanyPersistence[] {
    return this._companies;
  }
}

export const inMemoryDatabase = new InMemoryDatabase();
