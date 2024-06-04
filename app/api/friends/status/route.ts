import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: userSeverId } = auth();
    const { userId, friendId }: { userId: string; friendId: string } = body;

    if (!userSeverId) return new NextResponse("Unauthenticated", { status: 401 });

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { sender_id: userId, receiver_id: friendId },
          { sender_id: friendId, receiver_id: userId },
        ],
        AND: { denied: false },
      },
    });
    const friend = await prisma.friend.findFirst({
      where: {
        OR: [
          { user_id: userId, friend_id: friendId },
          { user_id: friendId, friend_id: userId },
        ],
      },
    });
    const follower = await prisma.follower.findFirst({
      where: {
        follower_id: userId,
        user_id: friendId,
      },
    });

    return NextResponse.json({ friendRequest, friend, follower });
  } catch (err) {
    console.log("[USERS_FRIEND_STATUS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
