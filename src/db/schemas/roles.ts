import { mysqlTable, int, mysqlEnum } from "drizzle-orm/mysql-core";

export const rolesTable = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: mysqlEnum("name", ["employee", "expert", "admin", "investor"])
    .notNull()
    .unique(),
});
