import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string; userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    let conversation = await prisma.conversation.findFirstOrThrow({
      include: {
        file: true,
        user: true,
        createdBy: true,
        conversationMembers: true,
      },
      where: { id: params.conversationId },
    });

    const isOwner = conversation.created_by === userId;

    if (isOwner) conversation = await adminLeave(conversation.id, userId);
    else await memberLeave(conversation.id, userId);

    // global.io.emit(`conversation:${conversation.id}`, conversation);
    global.io.emit(`${userId}:conversation:list:update`, {
      ...conversation,
      member_leaved: userId,
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATION_ID_USER_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function memberLeave(conversationId: string, userId: string) {
  await prisma.conversationMember.deleteMany({
    where: {
      conversation_id: conversationId,
      member_id: userId,
    },
  });
}

async function adminLeave(conversationId: string, userId: string) {
  await memberLeave(conversationId, userId);

  const oldestMember = await prisma.conversationMember.findFirst({
    where: { conversation_id: conversationId },
    orderBy: { created_at: "asc" },
  });

  const res = await prisma.conversation.update({
    include: {
      file: true,
      user: true,
      createdBy: true,
      conversationMembers: true,
    },
    where: { id: conversationId },
    data: {
      created_by: oldestMember?.member_id,
    },
  });

  return res;
}
