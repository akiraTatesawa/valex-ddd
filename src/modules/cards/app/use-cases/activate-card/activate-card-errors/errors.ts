/* eslint-disable max-classes-per-file */
import { Result } from "@core/logic/result";
import { ErrorInterface } from "@core/domain/error";

export namespace ActivateCardErrors {
  export class CardIsAlreadyActiveError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card is already active" }, null);
    }

    public static create(): CardIsAlreadyActiveError {
      return new CardIsAlreadyActiveError();
    }
  }

  export class InvalidPasswordError extends Result<null, ErrorInterface> {
    private constructor(message: string) {
      super(false, { message }, null);
    }

    public static create(message: string): InvalidPasswordError {
      return new InvalidPasswordError(message);
    }
  }
}
