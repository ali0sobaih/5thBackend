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

const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone, password } = (req as any)
      .validated as UserRegister;

    const existingEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingEmail.length > 0) {
      return errorResponse(res, "Email already registered", null, 409);
    }

    const user_name = `${first_name.toLowerCase()}_${last_name.toLowerCase()}`;

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.insert(usersTable).values({
      first_name,
      last_name,
      user_name,
      email,
      phone,
      password: hashed,
    });

    const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, result[0].insertId));

    const token = generateToken(
      {
        id: newUser.id,
        email: newUser.email,
      },
      "1h"
    );

    return success(
      res,
      "User registered successfully",
      {
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          userName: newUser.user_name,
          email: newUser.email,
          phone: newUser.phone,
        },
        token,
      },
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      "An error occurred during registration",
      error,
      500
    );
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req as any).validated as UserLogin;

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    const [user] = users;

    if (!user) {
      return errorResponse(
        res,
        "Invalid credentials - user not found",
        null,
        401
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(
        res,
        "Invalid credentials - password mismatch",
        null,
        401
      );
    }

    const token = generateToken({ id: user.id, email: user.email }, "1h");
    return success(res, "Logged in successfully", { token }, 200);
  } catch (error) {
    return errorResponse(res, "An error occurred while logging in", error, 500);
  }
};

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, "User not authenticated", null, 401);
    }

    await db.delete(usersTable).where(eq(usersTable.id, userId));

    return success(res, "User deleted and logged out", null, 200);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to logout",
      (error as Error).message,
      500
    );
  }
};

export default {
  register,
  login,
  logout,
};
