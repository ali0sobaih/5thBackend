import { mysqlTable, int, text, mysqlEnum } from "drizzle-orm/mysql-core";
import { GIScategoriesTable } from "./GIScategories";
import { quantitiesTable } from "./quantities";
import { locationsTable } from "./locations";
import { usersTable } from "./users";
import { timestamps } from "./timestamps.helpers";
import { studiesTable } from "./studies";

export const GISdataTable = mysqlTable("GISdata", {
  id: int("id").primaryKey().autoincrement(),
  author_id: int("author_id").references(() => usersTable.id),
  category_id: int("category_id")
    .references(() => GIScategoriesTable.id)
    .notNull(),
  location_id: int("location_id")
    .references(() => locationsTable.id)
    .notNull(),
  condition: mysqlEnum("condition", ["abundant", "in_use"]),
  accessibility: mysqlEnum("accessibility", ["good", "mediocre", "bad"]),
  study_id: int("study_id").references(() => studiesTable.id),
  quantity_id: int("quantity_id").references(() => quantitiesTable.id),
  note: text("note"),
  ...timestamps,
});

