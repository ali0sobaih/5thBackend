import { Request, Response } from "express";
import { success } from "@utils/response";
import { JwtPayload } from "@interfaces/jwt";
import { registerUser, loginUser, logoutUser } from "@services/authServices";
import { controllerWrapper } from "./wrapper";

export const register = controllerWrapper(
  async (req: Request, res: Response) => {
    const userData = (req as any).validated;
    const result = await registerUser(userData);
    return success(res, result.message, result.data, result.code);
  }
);

export const login = controllerWrapper(async (req: Request, res: Response) => {
  const userData = (req as any).validated;
  const result = await loginUser(userData);
  return success(res, result.message, result.data, result.code);
});

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const logout = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const result = await logoutUser(userId as number);
    return success(res, result.message, result.data, result.code);
  }
);
