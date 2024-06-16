import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";
import { UsedForEnum } from "@/lib/enum";

export async function PUT(
  req: Request,
  { params }: { params: { replyId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string;
    const commentId = formData.get("commentId") as string;
    const content = formData.get("content") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const post = await prisma.post.findFirstOrThrow({ where: { id: +postId } });

    const comment = await prisma.comment.findFirstOrThrow({
      where: { id: +commentId },
    });

    let reply = await prisma.commentReply.findFirstOrThrow({
      where: { id: +params.replyId },
    });

    const fileDB: IFile | null = await uploadFile({
      file,
      userId,
      used_for: UsedForEnum.reply,
      group_id: post.group_id || undefined,
    });

    reply = await prisma.commentReply.update({
      where: { id: reply.id },
      data: {
        content: content || "",
        file_id: fileDB?.id || reply.file_id,
      },
    });

    return NextResponse.json(reply);
  } catch (err) {
    console.log("[REPLY_ID_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { replyId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    let reply = await prisma.commentReply.findFirstOrThrow({
      include: { file: true },
      where: { id: +params.replyId },
    });

    if (reply.user_id !== userId)
      return new NextResponse("You do not have permission", { status: 404 });

    // Unlink & Delete files from folder & database
    const files: IFile[] = [];
    if (reply.file) files.push(reply.file);
    await unlinkFiles(files);

    await prisma.reaction.deleteMany({ where: { reply_id: reply.id } });

    const res = await prisma.commentReply.delete({ where: { id: reply.id } });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[REPLY_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function unlinkFiles(files: (IFile | null)[]) {
  if (!files.length) return;
  const fileIds: number[] = [];
  const unlinkPromises = files.map((file) => {
    if (!file) return;
    const filePath = path.resolve(__dirname, file.path);
    return fs.unlink(filePath).then(() => {
      fileIds.push(file.id);
    });
  });

  const results = await Promise.allSettled(unlinkPromises);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("File unlink failed:", result.reason);
    }
  });

  const res = await prisma.file.deleteMany({ where: { id: { in: fileIds } } });
  return res;
}
