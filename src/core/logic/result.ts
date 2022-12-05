import { Left, right, Right, left, Either } from "@core/logic/either";

export class Result<Value, Error> {
  public readonly isSuccess: boolean;

  public readonly isFailure: boolean;

  protected readonly _error: Error;

  protected readonly _value: Value;

  public constructor(isSuccess: boolean, error: Error, value: Value) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
  }

  public getValue(): Value {
    return this._value;
  }

  public getError(): Error {
    return this._error;
  }

  public static ok<T>(value: T) {
    return new Result<T, null>(true, null, value);
  }

  public static pass() {
    return new Result<null, null>(true, null, null);
  }

  public static combine<
    Error extends Result<unknown, unknown>,
    Success extends Result<unknown, unknown>
  >(results: Array<Left<Error, Success> | Right<Error, Success>>): Either<Error, unknown> {
    const firstFailedResult = results.find((result) => result.isLeft());

    if (firstFailedResult && firstFailedResult.isLeft()) {
      const error = firstFailedResult.value;

      return left(error);
    }

    return right(Result.pass());
  }
}
