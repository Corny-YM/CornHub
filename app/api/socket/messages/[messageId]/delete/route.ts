import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body: { conversationId: string; type: string } = await req.json();
    const { conversationId, type } = body;

    if (!conversationId)
      return new NextResponse("Conversation ID is required", { status: 404 });

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
    });
    if (!conversation)
      return new NextResponse("Conversation does not exist", { status: 404 });

    let message = await prisma.message.findFirst({
      include: { file: true },
      where: { id: +params.messageId },
    });

    if (!message)
      return new NextResponse("Message does not exist", { status: 404 });

    if (message.file_id && message.file) {
      try {
        const filePath = path.join(process.cwd(), "public", message.file.path);
        await fs.unlink(filePath);
        await prisma.file.deleteMany({ where: { id: message.file_id } });
      } catch (error) {
        console.log("[FILE_DELETE_ERROR]", error);
      }
    }

    const include = {
      sender: true,
      file: true,
      messageReactions: true,
      _count: { select: { messageReactions: true } },
    };

    if (type === "terminate") {
      await prisma.messageReaction.deleteMany({
        where: { message_id: message.id },
      });
      message = await prisma.message.delete({
        include: include,
        where: { id: message.id },
      });
    } else {
      message = await prisma.message.update({
        include: include,
        where: { id: message.id },
        data: {
          content: "Tin nhắn đã bị thu hồi",
          file_id: null,
          deleted: true,
        },
      });
    }

    const conversationKey = `conversation:${conversationId}:messages:update`;

    global.io.emit(conversationKey, { ...message, option: type });

    return NextResponse.json(message);
  } catch (err) {
    console.error("[MESSAGE_DELETE_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
