import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Group, File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

interface IBody {
  groupId?: number;
  userId: string;
  type?: number;
  status: string;
  content: string;
  file?: File;
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const status = formData.get("status") as string;
    const content = formData.get("content") as string;
    const groupId = formData.get("groupId") as string;

    const { userId: userServerId } = auth();
    if (!userServerId || !userId || userServerId !== userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const fileDB: IFile | null = await uploadFile({
      file,
      userId: userServerId,
      group_id: groupId && !isNaN(+groupId) ? +groupId : undefined,
    });

    let group: Group | null = null;
    if (groupId) {
      group = await prisma.group.findFirst({
        where: { id: +groupId },
      });
    }

    const isOwner = group?.owner_id === userId;
    const approve = isOwner || !group?.approve_posts;

    const post = await prisma.post.create({
      include: { user: true, group: true, file: true },
      data: {
        status,
        content,
        user_id: userServerId,
        approve: approve,
        group_id: groupId && !isNaN(+groupId) ? +groupId : null,
        file_id: fileDB ? fileDB.id : null,
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[POST_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
