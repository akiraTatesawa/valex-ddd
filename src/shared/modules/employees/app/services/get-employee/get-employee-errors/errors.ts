/* eslint-disable max-classes-per-file */
import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace GetEmployeeErrors {
  export class NotFoundError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Employee not found" }, null);
    }

    public static create(): NotFoundError {
      return new NotFoundError();
    }
  }

  export class InvalidEmployeeIdError extends Result<null, ErrorInterface> {
    private constructor(message: string) {
      super(false, { message }, null);
    }

    public static create(message: string): InvalidEmployeeIdError {
      return new InvalidEmployeeIdError(message);
    }
  }
}
