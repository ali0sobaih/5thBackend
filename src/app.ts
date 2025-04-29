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

app.use("/user", userRoutes);
app.use("/authorization", authorizationRoutes);
app.use("/chats", chatRoutes);

const PORT: number = parseInt(process.env.SERVER_PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
