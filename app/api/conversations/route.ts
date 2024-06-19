import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";
import { UsedForEnum } from "@/lib/enum";

interface IBody {
  name: string;
  ids: string[];
}

export async function POST(req: Request) {
  try {
    const body: IBody = await req.json();
    const { name, ids } = body;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 404 });

    const conversation = await prisma.conversation.create({
      data: { name, created_by: userId },
    });

    if (ids && ids.length) {
      await prisma.conversationMember.createMany({
        data: ids.map((id) => ({
          conversation_id: conversation.id,
          member_id: id,
        })),
      });
    }

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATIONS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
