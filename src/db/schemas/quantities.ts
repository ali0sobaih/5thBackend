import { int, varchar, mysqlTable } from "drizzle-orm/mysql-core";

export const quantitiesTable = mysqlTable("quantities", {
  id: int("id").primaryKey().autoincrement(),
  string_val: varchar("string_val", { length: 55 }),
  number_val: int("number_val"),
});