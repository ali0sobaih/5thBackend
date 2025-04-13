import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { success, error as errorResponse } from "@utils/response";
import { eq } from "drizzle-orm";

const giveRole = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
