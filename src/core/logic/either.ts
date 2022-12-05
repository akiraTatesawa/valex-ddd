/* eslint-disable max-classes-per-file */
export type Either<Error, Success> = Left<Error, Success> | Right<Error, Success>;

export class Left<Error, Success> {
  public readonly value: Error;

  constructor(value: Error) {
    this.value = value;

    Object.freeze(this);
  }

  public isLeft(): this is Left<Error, Success> {
    return true;
  }

  public isRight(): this is Right<Error, Success> {
    return false;
  }
}

export class Right<Error, Success> {
  public readonly value: Success;

  constructor(value: Success) {
    this.value = value;

    Object.freeze(this);
  }

  public isLeft(): this is Left<Error, Success> {
    return false;
  }

  public isRight(): this is Right<Error, Success> {
    return true;
  }
}

export const left = <Error, Success>(errorValue: Error) => new Left<Error, Success>(errorValue);

export const right = <Error, Success>(successValue: Success) =>
  new Right<Error, Success>(successValue);
