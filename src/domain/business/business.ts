import { Entity } from "@core/domain/entity";
import { Either, left, right } from "@core/logic/either";
import { Guard, GuardResult } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";
import { VoucherType } from "@shared/domain/voucher-type";
import { BusinessName } from "./business-name";

interface BusinessProps {
  name: BusinessName;
  type: VoucherType;
}

export interface BusinessCreateProps {
  id?: string;
  name: string;
  type: VoucherType;
}

type BusinessCreateResult = Either<DomainErrors.InvalidPropsError, Result<Business, null>>;

export class Business extends Entity<BusinessProps> {
  private constructor(props: BusinessProps, id?: string) {
    super(props, id);
  }

  public get name(): BusinessName {
    return this.props.name;
  }

  public get type(): VoucherType {
    return this.props.type;
  }

  public static create(props: BusinessCreateProps): BusinessCreateResult {
    const { name, type, id } = props;

    const guardResults: GuardResult[] = [Guard.againstNonVoucherType(type, "Business Type")];

    if (id !== undefined) {
      guardResults.push(Guard.againstNonUUID(id, "Business ID"));
    }

    const combinedResult = Guard.combineResults(guardResults);

    if (!combinedResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(combinedResult.message));
    }

    const businessNameOrError = BusinessName.create(name);

    if (businessNameOrError.isLeft()) {
      const businessNameError = businessNameOrError.value;

      return left(businessNameError);
    }

    const businessName = businessNameOrError.value.getValue();

    const business = new Business({ name: businessName, type }, id);

    return right(Result.ok<Business>(business));
  }
}
