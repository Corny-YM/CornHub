import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    const messageReactions = await prisma.messageReaction.findMany({
      include: { user: true },
      where: {
        message_id: +params.messageId,
        ...(type && type !== "all" && { type: type }),
      },
    });

    return NextResponse.json(messageReactions);
  } catch (err) {
    console.error("[MESSAGE_REACTION_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body: { conversationId: string; type: string } = await req.json();
    const { conversationId, type } = body;

    if (!type) return new NextResponse("Type is required", { status: 404 });

    if (!conversationId)
      return new NextResponse("Conversation ID is required", { status: 404 });

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
    });
    if (!conversation)
      return new NextResponse("Conversation does not exist", { status: 404 });

    let message = await prisma.message.findFirst({
      where: { id: +params.messageId },
    });

    if (!message)
      return new NextResponse("Message does not exist", { status: 404 });

    await prisma.messageReaction.upsert({
      where: {
        message_id_user_id: { message_id: message.id, user_id: userId },
      },
      update: { type: type },
      create: {
        message_id: message.id,
        user_id: userId,
        type: type,
      },
    });

    message = await prisma.message.findFirst({
      include: {
        sender: true,
        file: true,
        messageReactions: true,
        _count: { select: { messageReactions: true } },
      },
      where: { id: +params.messageId },
    });

    const conversationKey = `conversation:${conversationId}:messages:update`;

    global.io.emit(conversationKey, { ...message, option: type });

    return NextResponse.json(message);
  } catch (err) {
    console.error("[MESSAGE_REACTION_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
