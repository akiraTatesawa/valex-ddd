import { Either } from "@core/logic/either";
import { DomainErrors } from "@core/domain/domain-error";
import { Result } from "@core/logic/result";
import { Entity } from "@core/domain/entity";
import { randomUUID } from "crypto";
import { Guard } from "@core/logic/guard";
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

type ValidatePropsResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

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

  private static validateId(id: string | undefined): ValidatePropsResult {
    if (id === undefined) {
      return Result.pass();
    }

    const guardResult = Guard.againstNonUUID(id, "Company ID");

    if (!guardResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(guardResult.message);
    }

    return Result.pass();
  }

  private static validateApiKey(apiKey: string | undefined): ValidatePropsResult {
    if (apiKey === undefined) {
      return Result.pass();
    }

    const guardResult = Guard.againstNonUUID(apiKey, "Company API KEY");

    if (!guardResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(guardResult.message);
    }

    return Result.pass();
  }

  private static validateCreatedAt(createdAt: Date | undefined): ValidatePropsResult {
    if (createdAt === undefined) {
      return Result.pass();
    }
    const guardResult = Guard.againstNonDate(createdAt, "Company Created At");

    if (!guardResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(guardResult.message);
    }

    return Result.pass();
  }

  public static create(createProps: CreateCompanyProps): CreateCompanyResult {
    const { id, name, apiKey, createdAt } = createProps;

    const companyNameOrError = CompanyName.create(name);

    if (companyNameOrError.isFailure && companyNameOrError.error) {
      return companyNameOrError;
    }

    const results = [
      Company.validateId(id),
      Company.validateApiKey(apiKey),
      Company.validateCreatedAt(createdAt),
    ];

    const combinedResult = Result.combine(results);

    if (combinedResult.isFailure && combinedResult.error) {
      return combinedResult;
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
