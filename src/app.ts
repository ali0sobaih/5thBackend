import "./init"; //? To start every needed initialization

import express, { json } from "express";
import cors from "cors";
// import "./server";

// TODO: use index file to import all routers
import serverStatsRouter from "@routes/serverDiagnostics";
import userRoutes from "@routes/authRoutes";
import authorizationRoutes from "@routes/authorizationRouts";
import {
  AuthRouter,
  ServerDiagnosticsRouter,
  // ChatRouter,
  AuthorizationRouter,
  StudiesRouter,
  locationRouter,
  GISDataRouter,
} from "@routes";
// import chatRoutes from "@routes/chatRoutes";

// TODO: use index file to import middlewares
import { errorHandler } from "@middlewares/serverErrorHandler";
import { getConfigurations } from "@utils";

console.log(getConfigurations());
export const app = express();

app.use(cors());
app.use(json());

const VERSION = process.env.API_VERSION;

app.use(`/${VERSION}/test`, ServerDiagnosticsRouter);

app.use(`/${VERSION}/user`, AuthRouter);
app.use(`/${VERSION}/authorization`, AuthorizationRouter);
app.use(`/${VERSION}/studies`, StudiesRouter);
app.use(`/${VERSION}/locations`, locationRouter);
app.use(`/${VERSION}/GISData`, GISDataRouter);

// app.use(`/${VERSION}/chats`, ChatRouter);

app.use(errorHandler);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}/${VERSION}`);
});
