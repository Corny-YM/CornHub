import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { TypeConversationEnum } from "@/lib/enum";

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
      orderBy: { updated_at: "desc" },
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

    let conversation = await prisma.conversation.findFirst({
      include: {
        file: true,
        user: true,
        createdBy: true,
        conversationMembers: true,
      },
      where: { id: conversationId },
    });
    if (!conversation)
      return new NextResponse("Conversation does not exist", { status: 404 });

    let message = await prisma.message.findFirst({
      where: { id: +params.messageId },
    });

    if (!message)
      return new NextResponse("Message does not exist", { status: 404 });

    const messageReaction = await prisma.messageReaction.upsert({
      include: { user: true },
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

    const lastMessage =
      conversation.type === TypeConversationEnum.group
        ? `${messageReaction.user.full_name}: đã bày tỏ cảm xúc`
        : "Đã bày tỏ cảm xúc";

    conversation = await prisma.conversation.update({
      include: {
        file: true,
        user: true,
        createdBy: true,
        conversationMembers: true,
      },
      where: { id: conversation.id },
      data: {
        last_message: lastMessage,
        last_time_online: new Date(),
      },
    });

    // Emit for conversation
    const memberIds =
      conversation.type === TypeConversationEnum.group
        ? conversation.conversationMembers.map((item) => item.member_id)
        : [conversation.user_id, conversation.created_by];
    memberIds.forEach((id) => {
      global.io.emit(`${id}:conversation:list:update`, conversation);
    });

    // Emit for message
    const conversationKey = `conversation:${conversationId}:messages:update`;
    global.io.emit(conversationKey, { ...message, option: type });

    return NextResponse.json(message);
  } catch (err) {
    console.error("[MESSAGE_REACTION_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body: { conversationId: string; reactionId: number } =
      await req.json();
    const { conversationId, reactionId } = body;

    if (!reactionId)
      return new NextResponse("Reaction ID is required", { status: 404 });

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

    await prisma.messageReaction.delete({
      where: { id: +reactionId },
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

    global.io.emit(conversationKey, message);

    return NextResponse.json(message);
  } catch (err) {
    console.error("[MESSAGE_REACTION_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
