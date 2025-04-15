import { Request, Response, NextFunction } from "express";
import { ServerError } from "@errors/serverErrors";
import { error } from "@utils/response";

export const serverErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    if (err instanceof ServerError) {
      return error(res, err.message, err.data, 500);
    }

    console.error("Unhandled error:", err);
    return error(res, "Internal server error", null, 500);
};

