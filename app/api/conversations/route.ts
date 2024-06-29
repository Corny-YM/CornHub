import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Conversation, File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";
import { UsedForEnum } from "@/lib/enum";

interface IBody {
  name: string;
  ids: string[];
}

const CONVERSATION_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") as string;

    let conversations: Conversation[] = [];

    if (cursor) {
      conversations = await prisma.conversation.findMany({
        take: CONVERSATION_BATCH,
        skip: 1,
        cursor: { id: cursor },
        include: { file: true, user: true, createdBy: true },
        where: {
          active: 1,
          OR: [
            { created_by: userId },
            { user_id: userId },
            { conversationMembers: { some: { member_id: userId } } },
          ],
        },
        orderBy: { last_time_online: "desc" },
      });
    } else {
      conversations = await prisma.conversation.findMany({
        take: CONVERSATION_BATCH,
        include: { file: true, user: true, createdBy: true },
        where: {
          active: 1,
          OR: [
            { created_by: userId },
            { user_id: userId },
            { conversationMembers: { some: { member_id: userId } } },
          ],
        },
        orderBy: { last_time_online: "desc" },
      });
    }

    let nextCursor = null;

    if (conversations.length === CONVERSATION_BATCH) {
      nextCursor = conversations[CONVERSATION_BATCH - 1].id;
    }

    return NextResponse.json({
      items: conversations,
      nextCursor,
    });
  } catch (err) {
    console.log("[CONVERSATIONS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: IBody = await req.json();
    const { name, ids } = body;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 404 });

    const conversation = await prisma.conversation.create({
      include: { file: true, createdBy: true, user: true },
      data: { name, created_by: userId },
    });

    if (ids && ids.length) {
      await prisma.conversationMember.createMany({
        data: [
          { conversation_id: conversation.id, member_id: userId },
          ...ids.map((id) => ({
            member_id: id,
            conversation_id: conversation.id,
          })),
        ],
      });
    }

    // Send conversation to all members
    global.io.emit(`${userId}:conversation:list`, conversation);
    ids.forEach((id) => {
      global.io.emit(`${id}:conversation:list`, conversation);
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATIONS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
