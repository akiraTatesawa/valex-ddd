/* eslint-disable max-classes-per-file */
import { Result } from "@core/logic/result";
import { ErrorInterface } from "@core/domain/error";

export namespace CardUseCaseErrors {
  export class NotFoundError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Card not found" }, null);
    }

    public static create(): NotFoundError {
      return new NotFoundError();
    }
  }

  export class ExpiredCardError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card is expired" }, null);
    }

    public static create(): ExpiredCardError {
      return new ExpiredCardError();
    }
  }

  export class IncorrectCVVError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Incorrect Card CVV" }, null);
    }

    public static create(): IncorrectCVVError {
      return new IncorrectCVVError();
    }
  }

  export class WrongPasswordError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Wrong Password" }, null);
    }

    public static create(): WrongPasswordError {
      return new WrongPasswordError();
    }
  }

  export class WrongSecurityCodeError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "Wrong Security Code" }, null);
    }

    public static create(): WrongSecurityCodeError {
      return new WrongSecurityCodeError();
    }
  }

  export class InactiveCardError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card must be active" }, null);
    }

    public static create(): InactiveCardError {
      return new InactiveCardError();
    }
  }

  export class BlockedCardError extends Result<null, ErrorInterface> {
    private constructor() {
      super(false, { message: "The card is blocked" }, null);
    }

    public static create(): BlockedCardError {
      return new BlockedCardError();
    }
  }
}
