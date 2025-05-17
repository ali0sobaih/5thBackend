import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";


export const userExists = async (id: number) => {
  const bool = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if(bool) return true
  return false
};

