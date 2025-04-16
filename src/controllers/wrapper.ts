import { NextFunction, Request, Response } from "express";

type Controller =
  | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)
  | ((req: Request, res: Response) => void | Promise<void>);

export const controllerWrapper = (wrappedFunction: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await wrappedFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
