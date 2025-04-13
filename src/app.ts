import dotenv from "dotenv";
dotenv.config();

import userRoutes from './routes/authRoutes';
import express, { Application } from "express";

const app : Application = express();

app.use(express.json());
app.use("/user", userRoutes);


const PORT: number = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});