import { Company } from "../domain/company";
import { CompanyPersistence } from "../infra/database/company-persistence.interface";

export class CompanyMapper {
  public static toPersistence(data: Company): CompanyPersistence {
    return {
      id: data._id,
      name: data.name.value,
      apiKey: data.apiKey,
      createdAt: data.createdAt,
    };
  }

  public static toDomain(persistence: CompanyPersistence): Company {
    const companyOrError = Company.create({
      ...persistence,
    });

    return companyOrError.value.getValue()!;
  }
}
