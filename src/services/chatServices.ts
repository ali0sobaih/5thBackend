import { db } from "@db/connection";
import { messagesTable } from "@db/schemas/messages";
import { chatsTable } from "@db/schemas/chats";
import { textMessagesTable } from "@db/schemas/textMessages";
import { attachmentsTable } from "@db/schemas/attachments";
import { eq, sql, and } from "drizzle-orm";
import { ConflictError, NotFoundError } from "@errors/api";
import { getIO, getUserSocket } from "@utils/socket";

type SendMessageDTO = {
  chat_id: number;
  auth_id: number;
  content?: string;
  attachment?: {
    file_name: string;
    file_type: string;
    content: string;
  };
};

type editionData = {
  message_id: number;
  content?: string;
};

export const sendMessageService = async (messageData: SendMessageDTO) => {
  const { chat_id, auth_id, content, attachment } = messageData;

  const [chat] = await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.id, chat_id));

  if (!chat) {
    throw new NotFoundError("Chat not found");
  }

  const sender_id = auth_id;
  let receiver_id: number;
  if (chat.users1_id === sender_id) {
    receiver_id = chat.users2_id;
  } else if (chat.users2_id === sender_id) {
    receiver_id = chat.users1_id;
  } else {
    throw new NotFoundError("You are not part of this chat");
  }

  if (!content && !attachment) {
    throw new ConflictError("Message must contain text, attachment, or both");
  }

  let textMessageId: number | null = null;
  let attachmentId: number | null = null;

  if (content) {
    const result = await db.insert(textMessagesTable).values({ content });
    const insertId = result[0].insertId;

    const [textMessage] = await db
      .select()
      .from(textMessagesTable)
      .where(eq(textMessagesTable.id, insertId));

    textMessageId = textMessage.id;
  }

  if (attachment) {
    const result = await db.insert(attachmentsTable).values({
      file_name: attachment.file_name,
      file_type: attachment.file_type,
      content: attachment.content,
    });

    const insertId = result[0].insertId;
    const [attachmentRow] = await db
      .select()
      .from(attachmentsTable)
      .where(eq(attachmentsTable.id, insertId));

    attachmentId = attachmentRow.id;
  }

  await db.insert(messagesTable).values({
    attachment_id: attachmentId || null,
    textMessage_id: textMessageId || null,
    chat_id,
    sender_id,
    receiver_id,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const io = getIO();
  const receiverSocketId = getUserSocket(receiver_id);

  const [messageRow] = await db
    .select()
    .from(messagesTable)
    .where(
      and(
        eq(messagesTable.chat_id, chat_id),
        eq(messagesTable.sender_id, sender_id)
      )
    )
    .orderBy(sql`created_at DESC`)
    .limit(1); // Get the latest message

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      id: messageRow.id,
      chat_id,
      sender_id,
      receiver_id,
      content,
      attachment,
      created_at: messageRow.created_at,
    });
  }


  return {
    message: "sent!",
    data: messageData,
    code: 200,
  };
};

export const editMessageService = async (
  edition: editionData,
  sender_id: number
) => {
  const { message_id, content } = edition;

  const message = await db
    .select()
    .from(messagesTable)
    .where(
      and(
        eq(messagesTable.id, message_id),
        eq(messagesTable.sender_id, sender_id)
      )
    );

  if (!message[0]) throw new ConflictError("Message not found or unauthorized");

  await db
    .update(textMessagesTable)
    .set({ content })
    .where(eq(textMessagesTable.id, message_id));

  await db
    .update(messagesTable)
    .set({ updated_at: new Date() })
    .where(eq(messagesTable.textMessage_id, message_id));

  const updatedMessage = await db
    .select()
    .from(messagesTable)
    .leftJoin(
      textMessagesTable,
      eq(messagesTable.textMessage_id, textMessagesTable.id)
    )
    .where(eq(messagesTable.id, message_id));

  return {
    message: "message edited!",
    data: updatedMessage[0],
    code: 200,
  };
};

export const deleteMessageService = async (
  msg_id: number,
  sender_id: number
) => {
  const message = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.id, msg_id), eq(messagesTable.sender_id, sender_id))
    );

  if (!message[0]) throw new ConflictError("Message not found or unauthorized");

  await db.delete(messagesTable).where(eq(messagesTable.id, msg_id));

  if (message[0].textMessage_id) {
    await db
      .delete(textMessagesTable)
      .where(eq(textMessagesTable.id, message[0].textMessage_id));
  }

  if (message[0].attachment_id) {
    await db
      .delete(attachmentsTable)
      .where(eq(attachmentsTable.id, message[0].attachment_id));
  }

  return {
    message: "Message deleted",
    data: null,
    code: 200,
  };
};

export const messageRecivedService = async (msg_id: number) => {
  await db
    .update(messagesTable)
    .set({ received: true })
    .where(
      and(eq(messagesTable.id, msg_id), eq(messagesTable.received, false))
    );
};

export const messageSeenService = async (msg_id: number) => {
  await db
    .update(messagesTable)
    .set({ seen: true })
    .where(
      and(eq(messagesTable.id, msg_id), eq(messagesTable.seen, false))
    );
};

export const searchExistingChatsService = async (auth_id: number) => {
  const userChats = await db
    .select()
    .from(chatsTable)
    .where(
      sql`${chatsTable.users1_id} = ${auth_id} OR ${chatsTable.users2_id} = ${auth_id}`
    );

  if (userChats.length === 0) {
    return {
      message: "you don't have any chats yet!",
      data: null,
      code: 404,
    };
  }

  return {
    message: "your chats!",
    data: userChats,
    code: 200,
  };
};

export const startChatService = async (auth_id: any, other_id: number) => {
  if (!auth_id || !other_id) {
    throw new ConflictError("Both user IDs must be provided");
  }
  console.log("***********************" + auth_id);
  console.log("***********************" + other_id);

  const userChat = await db
    .select()
    .from(chatsTable)
    .where(
      sql`(${chatsTable.users1_id} = ${auth_id} AND ${chatsTable.users2_id} = ${other_id}) 
          OR 
          (${chatsTable.users1_id} = ${other_id} AND ${chatsTable.users2_id} = ${auth_id})`
    );

  if (userChat.length > 0) {
    return {
      message: "You already have a chat with this user!",
      data: userChat,
      code: 200,
    };
  }

  const newChat = await db
    .insert(chatsTable)
    .values({ users1_id: auth_id, users2_id: other_id });


  return {
    message: "Chat created successfully!",
    data: {
      "user 1": other_id,
      "user 2": auth_id,
    },
    code: 200,
  };
};
