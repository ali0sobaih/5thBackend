import { mysqlTable, int, timestamp, boolean } from "drizzle-orm/mysql-core";
import { attachmentsTable } from "./attachments";
import { chatsTable } from "./chats";
import { textMessagesTable } from "./textMessages";
import { timestamps } from "./timestamps.helpers";

export const messagesTable = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),

  attachment_id: int("attachment_id").references(() => attachmentsTable.id),
  textMessage_id: int("textMessage_id").references(() => textMessagesTable.id),
  chat_id: int("chat_id").references(() => chatsTable.id),

  sender_id: int("sender_id").notNull(),
  receiver_id: int("receiver_id").notNull(),

  seen: boolean("seen").notNull().default(false),
  received: boolean("received").notNull().default(false),
  ...timestamps,
});
