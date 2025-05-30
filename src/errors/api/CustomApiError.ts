export default class CustomApiError extends Error {
  #statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg);
    this.#statusCode = statusCode;
  }

  public get statusCode(): number {
    return this.#statusCode;
  }
}
