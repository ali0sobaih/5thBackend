import { mysqlTable, int, timestamp, boolean } from "drizzle-orm/mysql-core";
import { attachmentsTable } from "./attachments";
import { chatsTable } from "./chats";
import { textMessagesTable } from "./textMessages";

export const messagesTable = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),

  attachment_id: int("attachment_id").references(() => attachmentsTable.id),
  textMessage_id: int("textMessage_id").references(() => textMessagesTable.id),
  chat_id: int("chat_id").references(() => chatsTable.id),

  sender_id: int("sender_id").notNull(),
  receiver_id: int("receiver_id").notNull(),

  seen: boolean("seen").notNull().default(false),
  received: boolean("received").notNull().default(false),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
