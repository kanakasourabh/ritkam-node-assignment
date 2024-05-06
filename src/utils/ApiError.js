class ApiError extends Error {
  constructor(
    statuscode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.statuscode = statuscode;
    this.errors = errors;
    this.sucess = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
