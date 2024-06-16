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
  { params }: { params: { commentId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!postId)
      return new NextResponse("Post ID is required", { status: 404 });

    const post = await prisma.post.findFirst({ where: { id: +postId } });
    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    let comment = await prisma.comment.findFirst({
      where: { id: +params.commentId },
    });

    if (!comment)
      return new NextResponse("Comment does not exist", { status: 404 });

    const fileDB: IFile | null = await uploadFile({
      file,
      userId,
      used_for: UsedForEnum.comment,
      group_id: post.group_id || undefined,
    });

    comment = await prisma.comment.update({
      where: { id: comment.id },
      data: {
        content: content || "",
        file_id: fileDB?.id || comment.file_id,
      },
    });

    return NextResponse.json(comment);
  } catch (err) {
    console.log("[COMMENT_ID_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    let comment = await prisma.comment.findFirst({
      include: { file: true },
      where: { id: +params.commentId },
    });

    if (!comment)
      return new NextResponse("Comment does not exist", { status: 404 });

    if (comment.user_id !== userId)
      return new NextResponse("You do not have permission", { status: 404 });

    const replies = await prisma.commentReply.findMany({
      include: { file: true },
      where: { comment_id: comment.id },
    });

    // Unlink & Delete files from folder & database
    const files = replies.map((reply) => reply.file);
    if (comment.file) files.push(comment.file);
    await unlinkFiles(files);

    await prisma.commentReply.deleteMany({
      where: { comment_id: comment.id },
    });
    await prisma.reaction.deleteMany({ where: { comment_id: comment.id } });

    const res = await prisma.comment.delete({ where: { id: comment.id } });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[COMMENT_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function unlinkFiles(files: (IFile | null)[]) {
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
