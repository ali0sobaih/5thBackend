import { timestamp } from "drizzle-orm/mysql-core";

export const createdAt = timestamp("created_at").notNull().defaultNow();

export const updatedAt = timestamp("updated_at")
  .notNull()
  .defaultNow()
  .onUpdateNow();

export const timestamps = {
  created_at: createdAt,
  updated_at: updatedAt,
};
