import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/authRoutes";
import express from "express";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);

const PORT: number = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
