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
    const content = formData.get("content") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!postId)
      return new NextResponse("Post ID is required", { status: 404 });

    const post = await prisma.post.findFirst({ where: { id: +postId } });
    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    const fileDB: IFile | null = await uploadFile(file, userId);

    const comment = await prisma.comment.create({
      data: {
        content: content || "",
        post_id: +postId,
        user_id: userId,
        file_id: fileDB?.id,
      },
    });

    return NextResponse.json(comment);
  } catch (err) {
    console.log("[COMMENTS_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
