import { Request, Response } from "express";
import { success, error } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import {
  addCategoryService,
  addGeoDataService,
  addGeoFileService,
  getGeoTableService,
  getGeoMapService,
} from "../services/GISDataServices";
import { ConflictError } from "@errors/api";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const addCategory = controllerWrapper(async (req: Request, res: Response) => {
  const addCategoryData = (req as any).validated;
  const result = await addCategoryService(addCategoryData);
  return success(res, result.message, result.data, result.code);
});

const addGeoData = controllerWrapper(async (req: Request, res: Response) => {
  const geoData = (req as any).validated;
  const result = await addGeoDataService(geoData);
  return success(res, result.message, result.data, result.code);
});

const addGeoFile = controllerWrapper(async (req: Request, res: Response) => {
  const geoFile = (req as any).validated;
  const result = await addGeoFileService(geoFile);
  return success(res, result.message, result.data, result.code);
});

const getGeoTable = controllerWrapper(async (req: Request, res: Response) => {

  const page = Number(req.params.page) || 1; 
  const pageSize = Number(req.params.pageSize) || 10;

  if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
    return error(res, "Invalid page number", null, 400);
  }

  if (isNaN(pageSize) || pageSize < 1 || !Number.isInteger(pageSize)) {
    return error(res, "Invalid page size", null, 400);
  }
  const result = await getGeoTableService(page, pageSize);
  return success(res, result.message, result.data, result.code);
});

const getGeoMap = controllerWrapper(async (req: Request, res: Response) => {
  const result = await getGeoMapService();
  return success(res, result.message, result.data, result.code);
});

export default {
  addCategory,
  addGeoData,
  addGeoFile,
  getGeoTable,
  getGeoMap,
};
