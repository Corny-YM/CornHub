import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
      return new NextResponse("Authenticated", { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: { user: true, group: true },
      where: { user_id: params.userId, group_id: null },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.log("[USER_POSTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
