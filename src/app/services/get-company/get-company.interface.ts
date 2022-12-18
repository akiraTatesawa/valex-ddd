import { GetCompanyServiceResponse } from "./get-company.response";

export interface GetCompanyService {
  getCompany(apiKey: string): Promise<GetCompanyServiceResponse>;
}
