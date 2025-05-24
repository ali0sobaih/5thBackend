import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import {
  addPnPService,
  showPnPService,
} from "../services/privacy&policyServices";
 
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const addPnP = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const addPnPData = (req as any).validated;
    const result = await addPnPService(addPnPData);
    return success(res, result.message, result.data, result.code);
  }
);

export const showPnP = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await showPnPService();
    return success(res, result.message, result.data, result.code);
  }
);
