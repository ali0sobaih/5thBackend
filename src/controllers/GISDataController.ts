import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import { addCategoryService } from "../services/GISDataServices";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const addCategory = controllerWrapper(
  async (req: Request, res: Response) => {
  const addCategoryData = (req as any).validated;
  const result = await addCategoryService(addCategoryData);
  return success(res, result.message, result.data, result.code);
});

export default {
  addCategory,
};
