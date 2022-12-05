import { ErrorInterface } from "@core/domain/error";

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

  public static combine(results: Array<Result<any, null> | Result<null, ErrorInterface>>) {
    const firstFailedResult = results.find((result) => result.isFailure);

    if (firstFailedResult) {
      return firstFailedResult;
    }

    return Result.pass();
  }
}
