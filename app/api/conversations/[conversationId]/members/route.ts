import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

interface IBody {
  name: string;
  ids: string[];
}

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const conversation = await prisma.conversation.findFirst({
      include: {
        file: true,
        user: true,
        createdBy: true,
        conversationMembers: { include: { member: true } },
      },
      where: { id: params.conversationId },
    });

    const conversationMembers = conversation?.conversationMembers;

    return NextResponse.json(conversationMembers || []);
  } catch (err) {
    console.log("[CONVERSATION_ID_MEMBERS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body: { ids: string[] } = await req.json();
    const { ids } = body;

    const conversation = await prisma.conversation.findFirst({
      include: { file: true, createdBy: true, user: true },
      where: { id: params.conversationId },
    });

    if (!conversation)
      return new NextResponse("Conversation does not exist", { status: 404 });

    const res = await prisma.conversationMember.createMany({
      data: ids.map((id) => ({
        member_id: id,
        conversation_id: conversation.id,
      })),
    });

    ids.forEach((id) => {
      global.io.emit(`${id}:conversation:list`, conversation);
    });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[CONVERSATION_ID_MEMBERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body: { memberId: string } = await req.json();
    const { memberId } = body;

    const conversation = await prisma.conversation.findFirstOrThrow({
      include: { file: true, createdBy: true, user: true },
      where: { id: params.conversationId },
    });

    await prisma.conversationMember.deleteMany({
      where: { member_id: memberId, conversation_id: conversation.id },
    });

    const members = await prisma.conversationMember.findMany({
      include: { member: true },
      where: { conversation_id: conversation.id },
    });

    global.io.emit(`${memberId}:conversation:list:update`, {
      ...conversation,
      member_deleted: memberId,
    });

    return NextResponse.json(members);
  } catch (err) {
    console.log("[CONVERSATION_ID_MEMBERS_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
