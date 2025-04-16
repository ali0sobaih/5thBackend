import { Request, Response, NextFunction } from "express";
import { ServerError } from "@errors/serverErrors";
import { error } from "@utils/response";
import { CustomApiError } from "@errors/api";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomApiError) {
    // TODO: add data
    return error(res, err.message, null, err.statusCode);
  }

  if (err instanceof ServerError) {
    return error(res, err.message, err.data);
  }

  console.error("Unhandled error:", err);
  return error(res, "Internal server error", null);
};
