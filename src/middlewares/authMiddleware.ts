import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@interfaces/jwt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { UnauthorizedError, ForbiddenError } from "@errors/api";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & {
    authStrategy?: 'local' | 'google';
    token_version?: number;
  };
}

// دالة مساعدة لمعالجة أخطاء JWT
const handleJWTError = (err: Error): string => {
  if (err.name === 'TokenExpiredError') return 'Token expired';
  if (err.name === 'JsonWebTokenError') return 'Invalid token structure';
  if (err.name === 'NotBeforeError') return 'Token not yet valid';
  return 'Authentication failed';
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const SECRET = process.env.JWT_SECRET;
  
  // 1. التحقق من إعدادات السيرفر
  if (!SECRET) {
    console.error("JWT_SECRET is missing in environment variables");
    return next(new ForbiddenError("Server misconfiguration"));
  }

  // 2. استخراج التوكن من مصادر متعددة
  const token = req.headers.authorization?.split(" ")[1] 
    || req.cookies?.jwt 
    || req.query?.token;

  if (!token) {
    return next(new UnauthorizedError("No authentication token provided"));
  }

  try {
    // 3. فك تشفير التوكن
    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    // 4. التحقق من وجود البيانات الأساسية
    if (!decoded.id || !decoded.email) {
      throw new UnauthorizedError("Invalid token payload");
    }

    // 5. جلب بيانات المستخدم من قاعدة البيانات
    const [user] = await db
      .select({
        id: usersTable.id,
        token_version: usersTable.token_version,
        authStrategy: usersTable.google_id.isNotNull().mapWith('google').otherwise('local')
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.id));

    if (!user) {
      throw new UnauthorizedError("User account not found");
    }

    // 6. التحقق من تطابق إصدار التوكن
    if (decoded.token_version !== user.token_version) {
      throw new UnauthorizedError("Session expired");
    }

    // 7. تعيين بيانات المستخدم في الطلب
    req.user = {
      ...decoded,
      authStrategy: user.authStrategy,
      token_version: user.token_version
    };

    next();
  } catch (err: any) {
    // 8. معالجة الأخطاء التفصيلية
    const error = err instanceof Error ? err : new Error(err);
    const message = handleJWTError(error);
    
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError(message));
    }
    
    next(new ForbiddenError(message));
  }
};

export const requireAuthStrategy = (strategies: ('local' | 'google')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.authStrategy || !strategies.includes(req.user.authStrategy)) {
      return next(new ForbiddenError(
        `Required authentication methods: ${strategies.join(', ')}`
      ));
    }
    
    // تحقق إضافي لمستخدمي الجوجل
    if (req.user.authStrategy === 'google' && !req.user.token_version) {
      return next(new ForbiddenError("Invalid Google authentication"));
    }
    
    next();
  };
};