import { DomainErrors } from "@core/domain/domain-error";
import { ValueObject } from "@core/domain/value-object";
import { Either } from "@core/logic/either";
import { Guard } from "@core/logic/guard";
import { Result } from "@core/logic/result";

interface CompanyNameProps {
  value: string;
}

type CompanyNameCreateResult = Either<DomainErrors.InvalidPropsError, Result<CompanyName, null>>;

export class CompanyName extends ValueObject<CompanyNameProps> {
  private constructor(props: CompanyNameProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  private static validate(
    name: string
  ): Either<DomainErrors.InvalidPropsError, Result<null, null>> {
    const guardResults = [
      Guard.againstNullOrUndefined(name, "Company Name"),
      Guard.againstEmptyString(name, "Company Name"),
    ];

    const combinedResult = Guard.combineResults(guardResults);

    if (!combinedResult.succeeded) {
      return DomainErrors.InvalidPropsError.create(combinedResult.message);
    }

    if (name.length > 30) {
      return DomainErrors.InvalidPropsError.create(
        "Company Name cannot be longer than 30 characters"
      );
    }

    return Result.pass();
  }

  public static create(name: string): CompanyNameCreateResult {
    const validationResultOrError = CompanyName.validate(name);

    if (validationResultOrError.isFailure && validationResultOrError.error) {
      return validationResultOrError;
    }

    const companyNameValueObject = new CompanyName({ value: name });

    return Result.ok<CompanyName>(companyNameValueObject);
  }
}
