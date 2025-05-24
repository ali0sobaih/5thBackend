import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { AnyZodObject } from "zod";
import { error } from "../utils/response"; // or however you handle errors

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      (req as any).validated = schema.parse(req.body);
      next();
    } catch (err: any) {
      // TODO: make use of throw CustomAPIErrors. (wrap function with controllerWrapper)
      res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
};

export const validateFile =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Use the combined object from previous middleware
      const dataToValidate = (req as any).validated;

      if (!dataToValidate) {
        return error(res, "Validation failed", [
          { path: ["request"], message: "Missing combined data" },
        ]);
      }

      const parsed = schema.parse(dataToValidate);
      (req as any).validated = parsed;

      next();
    } catch (err: any) {
      return error(res, "Validation failed", err.errors || err);
    }
  };

