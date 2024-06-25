import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";
import { NextApiResponseServerIo } from "@/types";
import { TypeMessageEnum, UsedForEnum } from "@/lib/enum";

export async function PUT(req: Request, res: NextApiResponseServerIo) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const content = formData.get("content") as string;
    const conversationId = formData.get("conversationId") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!conversationId)
      return new NextResponse("Conversation ID is required", { status: 404 });

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
    });
    if (!conversation)
      return new NextResponse("Conversation does not exist", { status: 404 });

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

    global.io.emit(conversationKey, message);

    return NextResponse.json(message);
  } catch (err) {
    console.error("[MESSAGE_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
