import { mysqlTable, int, text, varchar } from "drizzle-orm/mysql-core";
import { customType } from "drizzle-orm/mysql-core";

const blob = customType<{ data: Buffer }>({
  dataType: () => "blob",
  toDriver: (value) => value.toString("hex"),
});

export const attachmentsTable = mysqlTable("attachments", {
  id: int("id").primaryKey().autoincrement(),
  content: text("content").notNull(),
  file_name: varchar("file_name", { length: 255 }).notNull(),
  file_type: varchar("file_type", { length: 100 }).notNull(),
});
