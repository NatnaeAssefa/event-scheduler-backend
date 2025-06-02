import moment from "moment";

const Messages = {
  /**
   * General Error Messages
   */
  ADMIN_NOT_FOUND: "Admin not found",
  NOT_IMPLEMENTED_ERROR: "Not Implemented!",
  SERVICE_UNAVAILABLE_ERROR: "Service Unavailable!",
  FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",
  INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
  UNAUTHORIZED_ERROR: "Authorization Failure: You're not authorized!",
};

export class Error {
  payload: any;
  statusCode: number;

  constructor(statusCode: number, errors: any[]) {
    this.statusCode = statusCode;
    this.payload = {
      timestamp: moment(),
      errors: errors,
    };
  }
}

/**
 * Bad Request Error
 */
export class BadRequestError extends Error {
  constructor(errors: any[]) {
    super(400, errors);
  }
}

/**
 * Already registered Error
 */
export class AlreadyRegisteredError extends Error {
  constructor(error: string) {
    super(409, [error]);
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(401, [message ?? Messages.UNAUTHORIZED_ERROR]);
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends Error {
  constructor(message?: string) {
    super(403, [message ?? Messages.FORBIDDEN_ERROR]);
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends Error {
  constructor(error: string) {
    super(404, [error]);
  }
}

/**
 * Internal Server Error
 */
export class InternalServerError extends Error {
  constructor(error?: string) {
    super(500, [
      error
        ? `Internal Server Error: ${error}`
        : Messages.INTERNAL_SERVER_ERROR,
    ]);
  }
}

/**
 * Not Implemented Error
 */
export class NotImplementedError extends Error {
  constructor(error?: string) {
    super(501, [
      error ? `Not Implemented: ${error}` : Messages.NOT_IMPLEMENTED_ERROR,
    ]);
  }
}

/**
 * Service Unavailable Error
 */
export class ServiceUnavailableError extends Error {
  constructor(error?: string) {
    super(502, [
      error
        ? `Service Unavailable: ${error}`
        : Messages.SERVICE_UNAVAILABLE_ERROR,
    ]);
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends Error {
  constructor(error: string) {
    super(409, [error]);
  }
}
