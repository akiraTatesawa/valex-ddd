/* eslint-disable max-classes-per-file */
import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";
import { VoucherType } from "@shared/domain/voucher-type";

export namespace CreateCardErrors {
  export class EmployeeNotBelongToCompanyError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Employee does not belong to the company" }, null);
    }

    public static create(): EmployeeNotBelongToCompanyError {
      return new EmployeeNotBelongToCompanyError();
    }
  }

  export class ConflictCardType extends Result<null, ErrorInterface> {
    private constructor(type: VoucherType) {
      super(false, { message: `The employee already has a '${type}' voucher card` }, null);
    }

    public static create(type: VoucherType): EmployeeNotBelongToCompanyError {
      return new ConflictCardType(type);
    }
  }
}
