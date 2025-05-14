import "./init"; //? To start every needed initialization

import express from "express";
import cors from "cors";
// import "./server";

// TODO: use index file to import all routers
import serverStatsRouter from "@routes/server-stats";
import userRoutes from "@routes/authRoutes";
import authorizationRoutes from "@routes/authorizationRouts";
// import chatRoutes from "@routes/chatRoutes";

// TODO: use index file to import middlewares
import { errorHandler } from "@middlewares/serverErrorHandler";

export const app = express();
app.use(express.json());
app.use(cors());

const VERSION = process.env.API_VERSION;

app.use(`/${VERSION}/test`, serverStatsRouter);

app.use(`/${VERSION}/user`, userRoutes);
app.use(`/${VERSION}/authorization`, authorizationRoutes);
// app.use(`/${VERSION}/chats`, chatRoutes);

app.use(errorHandler);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}/${VERSION}`);
});
