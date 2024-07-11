import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const post = await prisma.post.findFirst({
      include: {
        user: true,
        group: true,
        file: true,
        reactions: {
          where: { user_id: userId, comment_id: null, reply_id: null },
          take: 1,
        },
        _count: {
          select: {
            comments: true,
            reactions: { where: { comment_id: null, reply_id: null } },
          },
        },
      },
      where: { id: +params.postId },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[POST_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const user = await prisma.user.findFirst({
      where: { id: userId, is_admin: true },
    });

    const post = await prisma.post.findFirst({
      include: { group: true, file: true },
      where: { id: +params.postId },
    });

    if (!post) return new NextResponse("Post does not exist", { status: 404 });

    const hasPermission =
      user?.is_admin ||
      post.user_id === userId ||
      post.group?.owner_id === userId;
    if (!hasPermission)
      return new NextResponse("You do not have permission", { status: 401 });

    // Delete post => delete reactions, reports, comments, reply, files
    await prisma.notification.deleteMany({ where: { post_id: post.id } });
    await prisma.reaction.deleteMany({ where: { post_id: post.id } });
    await prisma.commentReply.deleteMany({ where: { post_id: post.id } });
    await prisma.comment.deleteMany({ where: { post_id: post.id } });

    const file = post.file;
    if (file) await deleteFile(file.id, file.path);

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[POST_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function deleteFile(id: number, url: string) {
  try {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath);
    await prisma.file.deleteMany({ where: { id: id } });
  } catch (error) {
    console.log("[FILE_DELETE_ERROR]", error);
    // Handle error, e.g., file might not exist, log it, etc.
  }
}
