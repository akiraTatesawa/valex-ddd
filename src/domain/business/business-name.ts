import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";

interface BusinessNameProps {
  value: string;
}

type BusinessNameCreate = Either<DomainErrors.InvalidPropsError, Result<BusinessName, null>>;

export class BusinessName extends ValueObject<BusinessNameProps> {
  private constructor(props: BusinessNameProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): BusinessNameCreate {
    if (name.length > 30) {
      return left(
        DomainErrors.InvalidPropsError.create("Business Name cannot be longer than 30 characters")
      );
    }

    if (name.length === 0) {
      return left(DomainErrors.InvalidPropsError.create("Business Name cannot be an empty string"));
    }

    const businessName = new BusinessName({ value: name });

    return right(Result.ok<BusinessName>(businessName));
  }
}
