import { Request, Response } from "express";
import { success } from "@utils/response";
import { JwtPayload } from "@interfaces/jwt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { 
    registerUser, 
    loginUser, 
    logoutUser 
} from "@services/authServices";
import { controllerWrapper } from "./wrapper";
import { generateToken } from "@utils/generateToken";
import { UnauthorizedError } from "@errors/api";
import { UserRegister, UserLogin } from "@validations/user.validation";

interface AuthenticatedRequest extends Request {
    user?: JwtPayload & {
        authStrategy?: 'local' | 'google';
        token_version?: number;
    };
}

interface ValidatedRequest extends Request {
    validated?: UserRegister | UserLogin;
}

const register = controllerWrapper(
    async (req: ValidatedRequest, res: Response) => {
        const userData = req.validated as UserRegister;
        const result = await registerUser(userData);
        return success(res, result.message, {
            user: result.data.user,
            token: result.data.token
        }, result.code);
    }
);

const login = controllerWrapper(
    async (req: ValidatedRequest, res: Response) => {
        const credentials = req.validated as UserLogin;
        const result = await loginUser(credentials);
        return success(res, result.message, {
            user: result.data.user,
            token: result.data.token
        }, result.code);
    }
);

const logout = controllerWrapper(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        const result = await logoutUser(userId);
        return success(res, result.message, result.data, result.code);
    }
);

const googleCallback = controllerWrapper(
    async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user?.id || !req.user?.email) {
            throw new UnauthorizedError("Google authentication failed");
        }

        const [currentUser] = await db
            .select({ token_version: usersTable.token_version })
            .from(usersTable)
            .where(eq(usersTable.id, req.user.id));

        if (!currentUser) {
            throw new UnauthorizedError("User not found");
        }

        const token = generateToken({
            id: req.user.id,
            email: req.user.email,
            authStrategy: 'google',
            token_version: currentUser.token_version
        }, "1h");

        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    }
);

export default {
    register,
    login,
    logout,
    googleCallback
};