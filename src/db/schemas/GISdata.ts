import { mysqlTable, int, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { GIScategoriesTable } from "./GIScategories";
import { quantitiesTable } from "./quantities";
import { locationsTable } from "./locations";
import { usersTable } from "./users";
import { timestamps } from "./timestamps.helpers";

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
  quantity_id: int("quantity_id").references(() => quantitiesTable.id),
  ...timestamps,
});

