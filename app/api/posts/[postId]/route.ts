import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

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
    if (
      post.user_id !== userId ||
      (post.group && post.group.owner_id !== userId)
    )
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
