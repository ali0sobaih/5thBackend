import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { permissionsTable } from "./permissions";
import { rolesTable } from "./roles";

export const rolesPermissionsTable = mysqlTable("role_permissions", {
  id: int("id").primaryKey().autoincrement(),
  permission_id: int("permission_id")
    .notNull()
    .references(() => permissionsTable.id),
  role_id: int("role_id")
    .notNull()
    .references(() => rolesTable.id),
});
