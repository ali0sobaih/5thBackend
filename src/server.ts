// server.ts
import { initEnv } from "@core";
initEnv();

import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { setIO, registerUserSocket, removeUserSocket } from "@utils/socket"; // Ensure correct path
import { ServerError } from "@errors/serverErrors";
import {
  messageRecivedService,
  messageSeenService,
} from "@services/chatServices";

const httpServer = createServer(app);
const PORT = process.env.SERVER_PORT;

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

setIO(io);
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("register", (userId: number) => {
    registerUserSocket(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("messageReceived", async ({ msg_id }) => {
    try {
      await messageRecivedService(msg_id);
      console.log(`Message ${msg_id} was received`);
    } catch (err) {
      return new ServerError(`Error marking message as received:`);
    }
  });

  socket.on("messageSeen", async ({ msg_id }) => {
    try {
      await messageSeenService(msg_id);
      console.log(`Message ${msg_id} was seen`);
    } catch (err) {
      return new ServerError(`Error marking message as seen:`);
    }
  });

  socket.on("disconnect", () => {
    removeUserSocket(socket.id);
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server Socket running on port ${PORT}`);
});
