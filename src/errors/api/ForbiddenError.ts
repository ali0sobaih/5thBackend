import CustomApiError from "./CustomApiError";

export default class ForbiddenError  extends CustomApiError {
  constructor(msg = "User is Forbidden for this action") {
    super(msg, 403);
  }
}
