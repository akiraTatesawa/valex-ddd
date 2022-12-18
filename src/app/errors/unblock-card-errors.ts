import { ErrorInterface } from "@core/domain/error";
import { Result } from "@core/logic/result";

export namespace UnblockCardErrors {
  export class CardIsAlreadyUnblockedError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card is already unblocked" }, null);
    }

    public static create(): CardIsAlreadyUnblockedError {
      return new CardIsAlreadyUnblockedError();
    }
  }
}
