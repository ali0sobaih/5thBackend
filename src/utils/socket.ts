// src/utils/socket.ts

import { Server } from "socket.io";

let io: Server;
const connectedUsers = new Map<number, string>(); // userId -> socketId

export const setIO = (serverInstance: Server) => {
  io = serverInstance;
};

console.log("socket.ts module initialized");

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const registerUserSocket = (userId: number, socketId: string) => {
  connectedUsers.set(userId, socketId);
};

export const removeUserSocket = (socketId: string) => {
  for (const [userId, id] of connectedUsers.entries()) {
    if (id === socketId) {
      connectedUsers.delete(userId);
      break;
    }
  }
};

export const getUserSocket = (userId: number) => {
  return connectedUsers.get(userId);
};
