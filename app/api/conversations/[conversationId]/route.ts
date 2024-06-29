import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export async function PUT(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const fileDB: IFile | null = await uploadFile({ file, userId: userId });

    const conversation = await prisma.conversation.update({
      include: { file: true, createdBy: true, user: true },
      where: { id: params.conversationId },
      data: { name, file_id: fileDB?.id, active: 1 },
    });

    const members = await prisma.conversationMember.findMany({
      where: { conversation_id: conversation.id },
    });
    members.forEach((mem) => {
      global.io.emit(`conversation:${conversation.id}`, conversation);
      global.io.emit(`${mem.member_id}:conversation:list:update`, conversation);
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATION_ID_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
