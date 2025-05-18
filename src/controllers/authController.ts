import { Request, Response } from "express";
import { success } from "@utils/response";
import { JwtPayload } from "@interfaces/jwt";
import {
  registerUser,
  loginUser,
  deleteAccountService,
  forgotPWService,
} from "@services/authServices";
import { controllerWrapper } from "./wrapper";

const register = controllerWrapper(async (req: Request, res: Response) => {
  const userData = (req as any).validated;
  const result = await registerUser(userData);
  return success(res, result.message, result.data, result.code);
});

const login = controllerWrapper(async (req: Request, res: Response) => {
  const userData = (req as any).validated;
  const result = await loginUser(userData);
  return success(res, result.message, result.data, result.code);
});

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const deleteAccount = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const result = await deleteAccountService(userId as number);
    return success(res, result.message, result.data, result.code);
  }
);

const forgotPW = controllerWrapper(
  async (req: Request, res: Response) => {
    const userData = (req as any).validated;
    const result = await forgotPWService(userData);
    return success(res, result.message, result.data, result.code);
  }
);

export default {
  register,
  login,
  deleteAccount,
  forgotPW,
};
