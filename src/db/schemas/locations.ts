import { json, mysqlTable, double, int, varchar } from "drizzle-orm/mysql-core";

export const locationsTable = mysqlTable("locations", {
  id: int("id").primaryKey().autoincrement(),
  center_long: double("center_long"),
  center_lat: double("center_lat"),
  area: json("area").$type<Array<[number, number]>>(), 
  name: varchar("name", {length: 55}) 
});
