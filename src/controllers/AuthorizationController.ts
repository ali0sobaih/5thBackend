import { Request, Response } from "express";
import { assignUserRole, removeUserRole } from "@services/authorizationServices";
import { success, error as errorResponse } from "@utils/response";

const giveRole = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { role } = (req as any).validated;

    await assignUserRole(userId, role);
    success(res, "Role assigned successfully", null, 200);
  } catch (err) {
    return errorResponse(res, "Faild role assignment!", null, 500);
  }
};

const deleteRole = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { role } = (req as any).validated;

    await removeUserRole(userId, role);
    success(res, "Role removed successfully", null, 200);
  } catch (err) {
    return errorResponse(res, "Faild role removal!", null, 500);
  }
};


export default {
  giveRole,
  deleteRole,
};