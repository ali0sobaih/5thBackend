import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const generateToken = (
  payload: object,
  expiresIn: string = "1h"
): string => {
  if (!SECRET) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, SECRET, { expiresIn } as SignOptions);
};
