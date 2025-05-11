import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import { addStudyService, showAIPendingService } from "../services/studiesService";


interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const addStudy = controllerWrapper(
    async (req: AuthenticatedRequest, res: Response) => {
        const authUserId = req.user?.id;
        const addStudyData = (req as any).validated;
        addStudyData.author_id = authUserId;
        const result = await addStudyService(addStudyData);
        return success(res, result.message, result.data, result.code);
    }   
);

const showAIPending = controllerWrapper(
  async (req: Request, res: Response) => {
    const addStudyData = (req as any).validated;
    const result = await showAIPendingService();
    return success(res, result.message, result.data, result.code);
  }
);


export default {
  addStudy,
  showAIPending,
};


