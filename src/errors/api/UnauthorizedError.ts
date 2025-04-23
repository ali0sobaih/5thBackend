import CustomApiError from "./CustomApiError";

export default class UnauthorizedError extends CustomApiError {
  constructor(msg = "User is unauthorized for this action") {
    super(msg, 401);
  }
}
