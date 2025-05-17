import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import { addLocationService } from "../services/locationServices";

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
  }

const addLocation = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const addLocationData = (req as any).validated;
    const result = await addLocationService(addLocationData);
    return success(res, result.message, result.data, result.code);
  }
)


export default {
  addLocation,
};