import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

export const GIScategoriesTable = mysqlTable("GIScategories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
});
