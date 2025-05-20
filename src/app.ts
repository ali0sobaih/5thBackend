import {} from "./init"; //? To start every needed initialization

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import "./server";
import userRoutes from "@routes/authRoutes";
import authorizationRoutes from "@routes/authorizationRouts";
import chatRoutes from "@routes/chatRoutes";
import { errorHandler } from "@middlewares/serverErrorHandler";

export const app = express();


app.use(express.json());
app.use(cors());


app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 ساعة
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(errorHandler);

const VERSION = process.env.API_VERSION;

app.use(`/user`, userRoutes);
app.use(`/${VERSION}/authorization`, authorizationRoutes);
app.use(`/${VERSION}/chats`, chatRoutes);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

