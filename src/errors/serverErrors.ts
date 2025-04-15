export class ServerError extends Error {
  public data: unknown;

  constructor(message: string, data: unknown = null) {
    super(message);
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}
