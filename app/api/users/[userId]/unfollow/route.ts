import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { followerId }: { followerId: string } = body;

    if (!userId || userId !== params.userId) {
      return new NextResponse("Authenticated", { status: 401 });
    }

    const follower = await prisma.follower.updateMany({
      where: { follower_id: userId, user_id: followerId },
      data: { status: false },
    });

    return NextResponse.json(follower);
  } catch (err) {
    console.log("[USERS_UNFOLLOW_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
