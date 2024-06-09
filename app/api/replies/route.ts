import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string;
    const commentId = formData.get("commentId") as string;
    const content = formData.get("content") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!postId)
      return new NextResponse("Post ID is required", { status: 404 });

    if (!commentId)
      return new NextResponse("Comment ID is required", { status: 404 });

    const post = await prisma.post.findFirst({ where: { id: +postId } });
    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    const comment = await prisma.comment.findFirst({
      where: { id: +commentId },
    });
    if (!comment)
      return new NextResponse("Comment does not exist", { status: 404 });

    const fileDB: IFile | null = await uploadFile(file, userId);

    const reply = await prisma.commentReply.create({
      data: {
        user_id: userId,
        post_id: +postId,
        comment_id: +commentId,
        content: content || "",
        file_id: fileDB?.id,
      },
    });

    return NextResponse.json(reply);
  } catch (err) {
    console.log("[REPLIES_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
