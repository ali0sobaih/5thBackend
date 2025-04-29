import express from "express";
import chatController from "@controllers/chatController";
import { validate } from "@middlewares/validate";
import {
  sendMessageSchema,
  editMessageSchema,
  deleteMessageSchema,
} from "@validations/message.validation";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/sendMessage",
  authMiddleware,
  validate(sendMessageSchema),
  chatController.sendMessage
);

router.post(
  "/editMessage",
  validate(editMessageSchema),
  authMiddleware,
  chatController.editMessage
);

router.post(
  "/deleteMessage",
  validate(deleteMessageSchema),
  authMiddleware,
  chatController.deleteMessage
);

router.post("/searchForChats", authMiddleware, chatController.searchForChats);

router.post("/startChat", authMiddleware, chatController.startChat);

export default router;
