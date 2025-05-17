import { varchar, mysqlTable, int } from "drizzle-orm/mysql-core";

export const investmentsTypesTable = mysqlTable("investmentsTypes", {
  id: int("id").primaryKey().autoincrement(),
  type: varchar("type", { length: 255 }).notNull(),
});
