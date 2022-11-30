import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { Result } from "@core/logic/result";
import { Entity } from "@core/domain/entity";
import { randomUUID } from "crypto";
import { CompanyName } from "./company-name";

interface CompanyProps {
  name: CompanyName;
  apiKey: string;
  createdAt: Date;
}

interface CreateCompanyProps {
  id?: string;
  name: string;
  apiKey?: string;
  createdAt?: Date;
}

type CreateCompanyResult = Either<DomainErrors.InvalidPropsError, Result<Company, null>>;

export class Company extends Entity<CompanyProps> {
  private constructor(props: CompanyProps, id?: string) {
    super(props, id);
  }

  public get name(): CompanyName {
    return this.props.name;
  }

  public get apiKey(): string {
    return this.props.apiKey;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(createProps: CreateCompanyProps): CreateCompanyResult {
    const { id, name, apiKey, createdAt } = createProps;

    const companyNameOrError = CompanyName.create(name);

    if (companyNameOrError.isFailure && companyNameOrError.error) {
      return companyNameOrError;
    }

    const companyName = companyNameOrError.value!;
    const companyAPIKey = apiKey ?? randomUUID();
    const companyCreatedAt = createdAt ?? new Date();

    const companyEntity = new Company(
      {
        name: companyName,
        apiKey: companyAPIKey,
        createdAt: companyCreatedAt,
      },
      id
    );

    return Result.ok<Company>(companyEntity);
  }
}
