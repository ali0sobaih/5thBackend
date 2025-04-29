import { Request, Response } from "express";
import {
  assignUserRole,
  removeUserRole,
} from "@services/authorizationServices";
import { success, error as errorResponse } from "@utils/response";
import { controllerWrapper } from "./wrapper";
import { JwtPayload } from "@interfaces/jwt";
import {
  sendMessageService,
  searchExistingChatsService,
  startChatService,
  editMessageService,
  deleteMessageService,
} from "@services/chatServices";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const sendMessage = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const authUserId = req.user?.id;
    const messageData = (req as any).validated;
    messageData.auth_id = authUserId;
    const result = await sendMessageService(messageData);
    return success(res, result.message, result.data, result.code);
  }
);

const editMessage = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const authUserId = req.user?.id as number;
    const messageData = (req as any).validated;
    const result = await editMessageService(messageData, authUserId);
    return success(res, result.message, result.data, result.code);
  }
);

const deleteMessage = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const authUserId = req.user?.id as number;
    const messageData = (req as any).validated;
    const result = await deleteMessageService(messageData, authUserId);
    return success(res, result.message, result.data, result.code);
  }
);

const searchForChats = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const authUserId = req.user?.id as number;
    const result = await searchExistingChatsService(authUserId);
    return success(res, result.message, result.data, result.code);
  }
);

const startChat = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const authUserId = req.user?.id;
    const { other_id } = req.body;
    const result = await startChatService(authUserId, other_id);
    return success(res, result.message, result.data, result.code);
  }
);

export default {
  sendMessage,
  searchForChats,
  startChat,
  editMessage,
  deleteMessage
};