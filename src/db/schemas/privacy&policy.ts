import { mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core";

export const privacyAndPolicyTable = mysqlTable("privacyAndPolicy", {
  id: int("id").primaryKey().autoincrement(),
  heading: varchar("heading", { length: 255 }).notNull(),
  content: text("content").notNull(),
});
