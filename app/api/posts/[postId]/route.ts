import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export async function PUT(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const status = formData.get("status") as string;
    const content = formData.get("content") as string;
    const groupId = formData.get("groupId") as string;
    const approve = formData.get("approve") as string;

    const { userId: userServerId } = auth();
    if (!userServerId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    let post = await prisma.post.findFirst({
      include: { user: true, group: true, file: true },
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    if (post.user_id !== userId && post.group && post.group.owner_id !== userId)
      return new NextResponse("You does not have permission", { status: 404 });

    const fileDB: IFile | null = await uploadFile({
      file,
      userId: userServerId,
      group_id: groupId && !isNaN(+groupId) ? +groupId : undefined,
    });

    post = await prisma.post.update({
      include: { user: true, group: true, file: true },
      where: { id: post.id },
      data: {
        status,
        content,
        group_id: groupId && !isNaN(+groupId) ? +groupId : post.group_id,
        file_id: fileDB ? fileDB.id : post.file_id,
        ...(approve ? { approve: !!+approve } : {}),
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[POST_ID_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const post = await prisma.post.findFirst({
      include: { group: true, file: true },
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post does not exist", { status: 404 });
    if (post.user_id !== userId && post.group && post.group.owner_id !== userId)
      return new NextResponse("You does not have permission", { status: 404 });

    // Delete post => delete reactions, reports, comments, reply, files
    await prisma.report.deleteMany({ where: { post_id: post.id } });
    await prisma.comment.deleteMany({ where: { post_id: post.id } });
    await prisma.commentReply.deleteMany({ where: { post_id: post.id } });
    await prisma.reaction.deleteMany({ where: { post_id: post.id } });

    if (post.file_id && post.file) {
      try {
        const filePath = path.join(process.cwd(), "public", post.file.path);
        await fs.unlink(filePath);
        await prisma.file.deleteMany({ where: { id: post.file_id } });
      } catch (error) {
        console.log("[FILE_DELETE_ERROR]", error);
        // Handle error, e.g., file might not exist, log it, etc.
      }
    }

    const res = await prisma.post.deleteMany({ where: { id: post.id } });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[POST_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
