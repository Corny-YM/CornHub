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
      include: { conversationMembers: { include: { member: true } } },
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

    return NextResponse.json(res);
  } catch (err) {
    console.log("[CONVERSATION_ID_MEMBERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
