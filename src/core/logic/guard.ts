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

  public static againstNonUUID(arg: any, argName: string): GuardResult {
    const isStringResult = Guard.againstNonString(arg, argName);

    if (!isStringResult.succeeded) {
      return isStringResult;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(arg)) {
      return {
        succeeded: false,
        message: `${argName} must be a valid UUID`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }

  public static againstNonDate(arg: any, argName: string): GuardResult {
    if (!(arg instanceof Date)) {
      return {
        succeeded: false,
        message: `${argName} must be a Date`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }

  public static againstNonInteger(arg: any, argName: string): GuardResult {
    if (typeof arg !== "number") {
      return {
        succeeded: false,
        message: `${argName} must be a number`,
      };
    }

    if (arg % 1 !== 0) {
      return {
        succeeded: false,
        message: `${argName} must be an integer`,
      };
    }

    return {
      succeeded: true,
      message: "OK",
    };
  }
}
