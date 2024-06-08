import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { Reaction } from "@prisma/client";

interface IBody {
  type: string;
  user_id: string;
  post_id: number;
  comment_id?: number;
  reply_id?: number;
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");
    const replyId = url.searchParams.get("replyId");
    const type = url.searchParams.get("type");

    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    if (!postId)
      return new NextResponse("Post Id is required", { status: 400 });

    const clause: Record<string, any> = {
      post_id: +postId,
      comment_id: null,
      reply_id: null,
    };

    if (commentId) clause.comment_id = +commentId;
    if (replyId) clause.reply_id = +replyId;
    if (type && type !== "all") clause.type = type;

    const reactions = await prisma.reaction.findMany({
      include: { user: true },
      where: { ...clause },
    });

    return NextResponse.json(reactions);
  } catch (err) {
    console.log("[REACTIONS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: userServerId } = auth();
    const { type, post_id, user_id, comment_id, reply_id }: IBody = body;

    if (!userServerId || !user_id || userServerId !== user_id) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }
    if (!post_id)
      return new NextResponse("Post Id is required", { status: 400 });
    if (!type)
      return new NextResponse("Type reaction is required", { status: 400 });

    const post = await prisma.post.findFirst({ where: { id: post_id } });
    if (!post) return new NextResponse("Post does not exist", { status: 400 });

    const existed = await prisma.reaction.findFirst({
      where: { user_id, post_id, comment_id, reply_id },
    });

    let result: Reaction | null = null;
    if (!existed) {
      result = await prisma.reaction.create({
        data: { user_id, post_id, comment_id, reply_id, type },
      });
    } else {
      result = await prisma.reaction.update({
        where: { id: existed.id },
        data: { type },
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.log("[REACTIONS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
