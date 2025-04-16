import {} from "./init.js"; //? To start every needed initialization

import express from "express";
import cors from "cors";

import userRoutes from "@routes/authRoutes";
import authorizationRoutes from "@routes/authorizationRouts";
import { errorHandler } from "@middlewares/serverErrorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.use("/user", userRoutes);
app.use("/authorization", authorizationRoutes);

const PORT: number = parseInt(process.env.SERVER_PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
