import { DomainErrors } from "@core/domain/domain-error";
import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
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
      return left(DomainErrors.InvalidPropsError.create(combinedResult.message));
    }

    if (name.length > 30) {
      return left(
        DomainErrors.InvalidPropsError.create("Company Name cannot be longer than 30 characters")
      );
    }

    return right(Result.pass());
  }

  public static create(name: string): CompanyNameCreateResult {
    const validationResult = CompanyName.validate(name);

    if (validationResult.isLeft()) {
      const domainError = validationResult.value;

      return left(domainError);
    }

    const companyNameValueObject = new CompanyName({ value: name });

    return right(Result.ok<CompanyName>(companyNameValueObject));
  }
}
