import { Company } from "@domain/company/company";
import { CompanyPersistence } from "@infra/data/persistence-model/company-persistence";

export class CompanyDataMapper {
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
