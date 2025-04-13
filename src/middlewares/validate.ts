import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      (req as any).validated = schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
};
