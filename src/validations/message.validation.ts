import { z } from "zod";
import { text } from "drizzle-orm/mysql-core";

export const sendMessageSchema = z
  .object({
    chat_id: z.number(),
    content: z.string().optional(),
    attachment: z
      .object({
        file_name: z.string().min(1),
        file_type: z.string().min(1),
        content: z.string().min(1),
      })
      .optional(),
  })
  .refine((data) => data.content || data.attachment, {
    message: "Message must contain text, attachment, or both",
  });

  export const editMessageSchema = z
    .object({
    content: z.string(),
    message_id: z.number(),
  });

  export const deleteMessageSchema = z.object({
    message_id: z.number(),
  });


export type sendMessage = z.infer<typeof sendMessageSchema>;
export type editMessage = z.infer<typeof editMessageSchema>;
export type deleteMessage = z.infer<typeof deleteMessageSchema>;
