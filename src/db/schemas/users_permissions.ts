import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { permissionsTable } from "./permissions";
import { usersTable } from "./users";

export const usersPermissionsTable = mysqlTable("users_permissions", {
  id: int("id").primaryKey().autoincrement(),
  permission_id: int("permission_id")
    .notNull()
    .references(() => permissionsTable.id),
  user_id: int("user_id")
    .notNull()
    .references(() => usersTable.id),
});
