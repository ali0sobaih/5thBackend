import jwt, { SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
  authStrategy?: 'local' | 'google';
  token_version?: number;
}

const SECRET = process.env.JWT_SECRET;

export const generateToken = (
  payload: TokenPayload, 
  expiresIn: string = "1h"
): string => {
  if (!SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

  const finalPayload: TokenPayload = {
    ...payload,
    token_version: payload.token_version || 0
  };

  return jwt.sign(finalPayload, SECRET, { expiresIn } as SignOptions);
};