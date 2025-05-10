import {
  mysqlTable,
  int,
  longtext,
  varchar,
  timestamp,
  mysqlEnum
} from "drizzle-orm/mysql-core";
import { locationsTable } from "./locations";
import { usersTable } from "./users";
import { timestamps } from "./timestamps.helpers";

export const studiesTable = mysqlTable("studies", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  author_id: int("author_id").references(() => usersTable.id),
  study: longtext("study").notNull(),
  status: mysqlEnum("status", [
    "ai_suggested",
    "approved",
    "byEmployees",
  ]).notNull(),
  location_id: int("location_id").references(() => locationsTable.id),
  ...timestamps,
});

