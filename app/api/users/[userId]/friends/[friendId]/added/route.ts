import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; friendId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    let userId = "";
    let friendId = "";
    const condition = currentUserId === params.userId;
    if (condition) {
      userId = params.userId;
      friendId = params.friendId;
    } else {
      userId = params.friendId;
      friendId = params.userId;
    }

    const friend = await prisma.friend.findFirst({
      include: { user: true, friend: true },
      where: { friend_id: friendId, user_id: userId },
    });

    return NextResponse.json(friend);
  } catch (err) {
    console.log("[USER_FRIENDS_ADDED_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
