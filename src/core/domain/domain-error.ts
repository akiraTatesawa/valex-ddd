import { Result } from "@core/logic/result";
import { ErrorInterface } from "./error";

export namespace DomainErrors {
  export class InvalidPropsError extends Result<null, ErrorInterface> {
    private constructor(message: string) {
      super(false, { message }, null);
    }

    public static create(errorMessage: string): InvalidPropsError {
      return new InvalidPropsError(errorMessage);
    }
  }
}
