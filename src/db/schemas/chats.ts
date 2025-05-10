import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { timestamps } from "./timestamps.helpers";


export const chatsTable = mysqlTable("chats", {
  id: int("id").primaryKey().autoincrement(),
  users1_id: int("users1_id")
    .notNull()
    .references(() => usersTable.id),
  users2_id: int("users2_id")
    .notNull()
    .references(() => usersTable.id),
    ...timestamps
});