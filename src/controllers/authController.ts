import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserLogin, UserRegister } from "@validations/user.validation";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { success, error as errorResponse } from "@utils/response";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import { JwtPayload } from "@interfaces/jwt";
import { registerUser, loginUser, logoutUser } from "@services/authServices";

export const register = async (req: Request, res: Response) => {
  const userData = (req as any).validated;
  const result = await registerUser(userData);
  return success(res, result.message, result.data, result.code);
};

const login = async (req: Request, res: Response) => {
  const userData = (req as any).validated;
  const result = await loginUser(userData);
  return success(res, result.message, result.data, result.code);
}; 

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const logout = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const result = await logoutUser(userId as number);
  return success(res, result.message, result.data, result.code);
};

export default {
  register,
  login,
  logout,
};
