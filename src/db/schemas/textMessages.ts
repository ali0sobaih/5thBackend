import { mysqlTable, int , text } from "drizzle-orm/mysql-core";


export const textMessagesTable = mysqlTable("textMessages", {
  id: int("id").primaryKey().autoincrement(),
  content: text("content").notNull(),
});