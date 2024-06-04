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
    const { friendId }: { friendId: string } = body;

    if (!userId || userId !== params.userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const friend = await prisma.friend.deleteMany({
      where: {
        OR: [
          { friend_id: friendId, user_id: userId },
          { friend_id: userId, user_id: friendId },
        ],
      },
    });
    await prisma.follower.deleteMany({
      where: {
        OR: [
          { follower_id: friendId, user_id: userId },
          { follower_id: userId, user_id: friendId },
        ],
      },
    });

    return NextResponse.json(friend);
  } catch (err) {
    console.log("[USERS_UNFRIEND_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
