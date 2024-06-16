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

    console.log(params.commentId);

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
