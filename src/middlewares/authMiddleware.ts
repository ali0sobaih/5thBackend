import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@interfaces/jwt";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!SECRET) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
