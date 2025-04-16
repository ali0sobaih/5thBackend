import CustomApiError from "./CustomApiError.js";

export default class NotFoundError extends CustomApiError {
  constructor(msg = "Item was not found") {
    super(msg, 404);
  }
}
