import {} from "./init.js"; //? To start every needed initialization
import userRoutes from "@routes/authRoutes";
import express from "express";
import authorizationRoutes from '@routes/authorizationRouts'

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/authorization", authorizationRoutes);

const PORT: number = parseInt(process.env.SERVER_PORT || "3000", 10);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
