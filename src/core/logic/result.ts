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

  public get value(): Value {
    return this._value as Value;
  }

  public get error(): Error {
    return this._error as Error;
  }

  public static ok<T>(value: T) {
    return new Result<T, null>(true, null, value);
  }

  public static pass() {
    return new Result<null, null>(true, null, null);
  }

  public static fail<U>(error: U) {
    return new Result<null, U>(false, error, null);
  }
}
