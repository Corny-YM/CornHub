import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");
    const replyId = url.searchParams.get("replyId");

    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    if (!postId)
      return new NextResponse("Post Id is required", { status: 400 });

    const clause: Record<string, any> = {};

    if (commentId) clause.comment_id = +commentId;
    if (replyId) clause.reply_id = +replyId;

    const reactions = await prisma.reaction.groupBy({
      by: ["type"],
      where: { post_id: +postId },
      _count: { _all: true },
    });

    return NextResponse.json(reactions);
  } catch (err) {
    console.log("[REACTIONS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
