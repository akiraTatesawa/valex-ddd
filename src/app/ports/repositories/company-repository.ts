import { Repository } from "@core/app/repository";
import { Company } from "@domain/company/company";

export interface CompanyUniqueArgs {
  id?: string;
  name?: string;
  apiKey?: string;
}

export interface CompanyRepository extends Repository<Company> {
  findUnique(uniqueArgs: CompanyUniqueArgs): Promise<Company | null>;
}
