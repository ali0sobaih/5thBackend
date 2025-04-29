import {} from "./init"; //? To start every needed initialization

import express from "express";
import cors from "cors";
import "./server";
import userRoutes from "@routes/authRoutes";
import authorizationRoutes from "@routes/authorizationRouts";
import chatRoutes from "@routes/chatRoutes";
import { errorHandler } from "@middlewares/serverErrorHandler";

export const app = express();
app.use(express.json());
app.use(cors());
app.use(errorHandler);

const VERSION = process.env.API_VERSION;

app.use(`/${VERSION}/user`, userRoutes);
app.use(`/${VERSION}/authorization`, authorizationRoutes);
app.use(`/${VERSION}/chats`, chatRoutes);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}/${VERSION}`);
});
