export interface GuardResult {
  message: string;
  succeeded: boolean;
}

export class Guard {
  public static combineResults(results: GuardResult[]): GuardResult {
    const firstFailedResult = results.find((result) => !result.succeeded);

    if (firstFailedResult) {
      return firstFailedResult;
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }

  public static againstNullOrUndefined(arg: any, argName: string): GuardResult {
    if (arg === null || arg === undefined) {
      return {
        succeeded: false,
        message: `${argName} cannot be null or undefined`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }

  public static againstNonString(arg: any, agrName: string): GuardResult {
    const isString = typeof arg === "string";

    if (!isString) {
      return {
        succeeded: false,
        message: `${agrName} must be a string`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }

  public static againstEmptyString(arg: string, argName: string): GuardResult {
    const againstNonStringResult = Guard.againstNonString(arg, argName);

    if (!againstNonStringResult.succeeded) {
      return againstNonStringResult;
    }

    if (arg.length === 0) {
      return {
        succeeded: false,
        message: `${argName} cannot be an empty string`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }
}
