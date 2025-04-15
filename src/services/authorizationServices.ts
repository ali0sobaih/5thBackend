import { db } from "@db/connection";
import { rolesUsersTable } from "@db/schemas/users_roles";
import { rolesTable } from "@db/schemas/roles";
import { eq, and } from "drizzle-orm";
import { assignRole } from "@validations/autherization.validation";

export const assignUserRole = async (userId: number, roleName: string) => {
  const [roleRecord] = await db
    .select({ id: rolesTable.id })
    .from(rolesTable)
    .where(eq(rolesTable.name, roleName as any));
  if (!roleRecord) throw new Error("Invalid role name");

  const given = await db
    .delete(rolesUsersTable)
    .where(
      and(
        eq(rolesUsersTable.users_id, userId),
        eq(rolesUsersTable.role_id, roleRecord.id)
      )
    );
  if (given.length > 0 ) {
    throw new Error("role already given to this user");
  }

  await db.insert(rolesUsersTable).values({
    users_id: userId,
    role_id: roleRecord.id,
  });

  return { userId, roleId: roleRecord.id };
};

export const removeUserRole = async (userId: number, roleName: string) => {
  const [roleRecord] = await db
    .select({ id: rolesTable.id })
    .from(rolesTable)
    .where(eq(rolesTable.name, roleName as any));

  if (!roleRecord) throw new Error("Invalid role name");

  await db
    .delete(rolesUsersTable)
    .where(
      and(
        eq(rolesUsersTable.users_id, userId),
        eq(rolesUsersTable.role_id, roleRecord.id)
      )
    );

  return true;
};
