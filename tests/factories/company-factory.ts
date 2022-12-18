import { randText, randNumber } from "@ngneat/falso";
import { Factory } from "@core/app/factory";
import { Company } from "@domain/company/company";

interface CompanyFactoryGenerateProps {
  id?: string;
  name?: string;
  apiKey?: string;
  createdAt?: Date;
}

export class CompanyFactory extends Factory<Company> {
  public generate({ ...props }: CompanyFactoryGenerateProps = {}): Company {
    const companyOrError = Company.create({
      name: randText({ charCount: randNumber({ min: 1, max: 29 }) }),
      ...props,
    });

    return companyOrError.value.getValue()!;
  }
}
