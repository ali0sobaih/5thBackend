import { varchar, mysqlTable, int } from "drizzle-orm/mysql-core";

export const GIScategoriesTable = mysqlTable("GIScategories", {
  id: int("id").primaryKey().autoincrement(),
  type: varchar("type", { length: 255 }).notNull(),
});
