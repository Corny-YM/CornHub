import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import formidable, { Fields, Files, IncomingForm } from "formidable";

import { NextApiResponseServerIo } from "@/types";
import { TypeMessageEnum, UsedForEnum } from "@/lib/enum";
import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export const config = {
  api: { bodyParser: false },
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const content = fields?.content?.[0];
    const conversationId = fields?.conversationId?.[0];
    const file = files?.file?.[0] || null;

    const { userId } = await getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });

    if (!conversationId)
      return res.status(404).json({ message: "Conversation ID is required" });

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
    });
    if (!conversation)
      return res.status(404).json({ message: "Conversation does not exist" });

    const fileDB = await uploadFile({
      file: file as File | null,
      userId,
      used_for: UsedForEnum.message,
    });

    const message = await prisma.message.create({
      include: { sender: true, file: true },
      data: {
        conversation_id: conversation.id,
        sender_id: userId,
        file_id: fileDB?.id,
        content: content,
        type: fileDB?.id ? TypeMessageEnum.file : TypeMessageEnum.message,
      },
    });

    const conversationKey = `conversation:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.error("[MESSAGE_PUT]", err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default handler;
