import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

interface IBody {
  groupId?: number;
  userId: string;
  type?: number;
  status: string;
  content: string;
  file?: File;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: userServerId } = auth();
    const { userId, status, type, content, groupId, file }: IBody = body;

    if (!userServerId || !userId || userServerId !== userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        type,
        status,
        content,
        user_id: userServerId,
        group_id: groupId,
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[USERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
