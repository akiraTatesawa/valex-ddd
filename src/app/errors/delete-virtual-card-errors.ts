import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace DeleteVirtualCardErrors {
  export class NotVirtualError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card must be virtual" }, null);
    }

    public static create(): NotVirtualError {
      return new NotVirtualError();
    }
  }
}
