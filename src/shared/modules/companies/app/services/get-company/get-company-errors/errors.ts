/* eslint-disable max-classes-per-file */
import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace GetCompanyErrors {
  export class NotFoundError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Company not found" }, null);
    }

    public static create(): NotFoundError {
      return new NotFoundError();
    }
  }

  export class InvalidApiKeyError extends Result<null, ErrorInterface> {
    private constructor(message: string) {
      super(false, { message }, null);
    }

    public static create(message: string): InvalidApiKeyError {
      return new InvalidApiKeyError(message);
    }
  }
}
