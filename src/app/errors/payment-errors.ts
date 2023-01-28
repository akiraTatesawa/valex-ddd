/* eslint-disable max-classes-per-file */
import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace PaymentErrors {
  export class IncompatibleTypesError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Business Type must be the same as the Card Type" }, null);
    }

    public static create(): IncompatibleTypesError {
      return new IncompatibleTypesError();
    }
  }

  export class InsufficientBalance extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Insufficient Card Balance" }, null);
    }

    public static create(): InsufficientBalance {
      return new InsufficientBalance();
    }
  }
}
