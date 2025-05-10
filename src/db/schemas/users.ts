import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { timestamps } from "./timestamps.helpers";

export const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  user_name: varchar("user_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  ...timestamps,
});
