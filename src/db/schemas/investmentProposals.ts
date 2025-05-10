import { mysqlTable, int, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { timestamps } from "./timestamps.helpers";

export const investmentProposalsTable = mysqlTable("investmentProposals", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "canceled", "accepted", "rejected"]),
  ...timestamps,
});
