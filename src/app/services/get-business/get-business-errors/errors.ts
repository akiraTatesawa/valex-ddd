import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace GetBusinessErrors {
  export class NotFoundError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Business not found" }, null);
    }

    public static create(): NotFoundError {
      return new NotFoundError();
    }
  }
}
