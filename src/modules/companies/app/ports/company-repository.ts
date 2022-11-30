import { Repository } from "@core/app/repository";
import { Company } from "@modules/companies/domain/company";

export interface CompanyUniqueArgs {
  id?: string;
  name?: string;
}

export interface CompanyRepository extends Repository<Company> {
  findUnique(uniqueArgs: CompanyUniqueArgs): Promise<Company | null>;
}
