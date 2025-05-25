import { mysqlTable, int, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { timestamps } from "./timestamps.helpers";
import { investmentsTypesTable } from "./investmentTypes";
import { locationsTable } from "./locations";

export const investmentProposalsTable = mysqlTable("investmentProposals", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "canceled", "accepted", "rejected"]),
  type_id: int("type_id")
    .references(() => investmentsTypesTable.id)
    .notNull(),
  location_id: int("location_id")
    .references(() => locationsTable.id)
    .notNull(),
  ...timestamps,
});
  