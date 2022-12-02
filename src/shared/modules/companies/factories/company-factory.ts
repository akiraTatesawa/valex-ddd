import { randCompanyName } from "@ngneat/falso";
import { Factory } from "@core/app/factory";
import { Company } from "../domain/company";

interface CompanyFactoryGenerateProps {
  id?: string;
  name?: string;
  apiKey?: string;
  createdAt?: Date;
}

export class CompanyFactory extends Factory<Company> {
  public generate({ ...props }: CompanyFactoryGenerateProps = {}): Company {
    const companyOrError = Company.create({
      name: randCompanyName(),
      ...props,
    });

    return companyOrError.value!;
  }
}
