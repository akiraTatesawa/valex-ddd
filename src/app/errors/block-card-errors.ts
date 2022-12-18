import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace BlockCardErrors {
  export class CardIsAlreadyBlockedError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card is already blocked" }, null);
    }

    public static create(): CardIsAlreadyBlockedError {
      return new CardIsAlreadyBlockedError();
    }
  }
}
