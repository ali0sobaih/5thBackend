import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import {
  addStudyService,
  saveStudyService,
  showAIPendingService,
  updateLocationService,
  updateGISService,
  setMinEntriesService,
} from "../services/studiesServices";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const addStudy = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const addStudyData = (req as any).validated;
    const result = await addStudyService(addStudyData);
    return success(res, result.message, result.data, result.code);
  }
);

const updateLocation = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const updateLocationData = (req as any).validated;
    const result = await updateLocationService(updateLocationData);
    return success(res, result.message, result.data, result.code);
  }
);    

const updateGIS = controllerWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const updateGISData = (req as any).validated;
    const study_id = Number(req.params.study_id);
    const result = await updateGISService(study_id ,updateGISData);
    return success(res, result.message, result.data, result.code);
  }
); 

const saveStudy = controllerWrapper(
  async (req: Request, res: Response) => {
    const study_id = Number(req.params.study_id);
    const result = await saveStudyService(study_id);
    return success(res, result.message, result.data, result.code);
  }
);

const setMinRecommendedEntries = controllerWrapper(
  async (req: Request, res: Response) => {
    const num = Number(req.params.num);
    const result = await setMinEntriesService(num);
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
  updateLocation,
  updateGIS,
  setMinRecommendedEntries,
  saveStudy,
};
