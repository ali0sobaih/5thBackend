import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/api";

export const requireAuthStrategy = (strategies: ('local' | 'google')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as { authStrategy?: string };
        
        if (!user?.authStrategy || !strategies.includes(user.authStrategy as any)) {
            throw new ForbiddenError("Unsupported authentication method");
        }
        
        next();
    };
};