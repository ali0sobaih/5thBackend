import "./init"; //? To start every needed initialization

import express, { json } from "express";
import cors from "cors";
// import "./server";

import {
  AuthRouter,
  ServerDiagnosticsRouter,
  // ChatRouter,
  AuthorizationRouter,
  StudiesRouter,
  locationRouter,
  GISDataRouter,
  PnPRouter,
} from "@routes";
// import chatRoutes from "@routes/chatRoutes";

// TODO: use index file to import middlewares
import { errorHandler } from "@middlewares/serverErrorHandler";

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
app.use(`/${VERSION}/PnP`, PnPRouter);

// app.use(`/${VERSION}/chats`, ChatRouter);

app.use(errorHandler);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}/${VERSION}`);
});
