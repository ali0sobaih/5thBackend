import CustomApiError from "./CustomApiError.js";

export default class ConflictError extends CustomApiError {
  constructor(msg = "Couldn't create or update") {
    super(msg, 409);
  }
}
