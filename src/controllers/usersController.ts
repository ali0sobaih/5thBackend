import { Request, Response } from "express";
import { success } from "../utils/response";
import { JwtPayload } from "../interfaces/jwt";
import { controllerWrapper } from "./wrapper";
import {
  getEmployeesService,
  searchForEmpService,
} from "../services/usersService";

export const getEmployees = controllerWrapper(
  async (req: Request, res: Response) => {
    const result = await getEmployeesService();
    return success(res, result.message, result.data, result.code);
  }
);

export const searchEmployee = controllerWrapper(
  async (req: Request, res: Response) => {
    const searchTerm = (req as any).validated;
    const result = await searchForEmpService(searchTerm);
    return success(res, result.message, result.data, result.code);
  }
);


 