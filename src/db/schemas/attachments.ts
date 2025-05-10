import {
  mysqlTable,
  int,
  longtext,
  varchar,
} from "drizzle-orm/mysql-core";

export const attachmentsTable = mysqlTable("attachments", {
  id: int("id").primaryKey().autoincrement(),
  content: longtext("content").notNull(),
  file_name: varchar("file_name", { length: 255 }).notNull(),
  file_type: varchar("file_type", { length: 100 }).notNull(),
});
 
