import CustomApiError from "./CustomApiError";

export default class NotFoundError extends CustomApiError {
  constructor(msg = "Item was not found") {
    super(msg, 404);
  }
}
