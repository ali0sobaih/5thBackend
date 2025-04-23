import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";

export const permissionsTable = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});
