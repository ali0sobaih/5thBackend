import bcrypt from 'bcrypt';            
import { Request, Response } from 'express';  
import { db } from "../db/connection";
import { rolesUsersTable } from "../db/schemas/users_roles";
import { rolesTable } from "../db/schemas/roles";
import { success, error as errorResponse } from "../utils/response";
import { eq } from "drizzle-orm";  
import { assignRole } from '../validations/autherization.validation';
import { number } from 'zod';


const giveRole = async (req: Request, res: Response) => {
    try {
      const user_id = Number(req.params.id);
      const { role } = (req as any).validated as assignRole;
  
      const [roleRecord] = await db
        .select({ id: rolesTable.id })
        .from(rolesTable)
        .where(eq(rolesTable.name, role as any));
  
      if (!roleRecord) {
        return errorResponse(res, "invalide role name", null, 400);
      }
  
      await db.insert(rolesUsersTable).values({
        users_id: user_id,
        role_id: roleRecord.id,
      });
  
      return success(res, "User roele added", null, 200);
  
    }catch (error) {
       return errorResponse(res, "Faild role assignment!", null, 500);
    }
};

const deleteRole = async (req: Request, res: Response) => {
    try {
      const user_id = Number(req.params.id);
      const { role } = (req as any).validated as assignRole;
  
      const [roleRecord] = await db
        .select({ id: rolesTable.id })
        .from(rolesTable)
        .where(eq(rolesTable.name, role as any));
  
      if (!roleRecord) {
        return errorResponse(res, "invalide role name", null, 400);
      }

      const given = await db
        .delete(rolesTable)
        .where(eq(rolesTable.id, user_id));
  
      await db.insert(rolesUsersTable).values({
        users_id: user_id,
        role_id: roleRecord.id,
      });
  
      return success(res, "User roele added", null, 200);
  
    }catch (error) {
       return errorResponse(res, "Faild role assignment!", null, 500);
    }
};

export default {
giveRole,
deleteRole,
}