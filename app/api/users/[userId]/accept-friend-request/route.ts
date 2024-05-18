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
      return new NextResponse("Authenticated", { status: 401 });
    }

    // if a person accept the friendRequest => that person is friend_id
    const friend = await prisma.friend.create({
      data: { friend_id: userId, user_id: friendId },
    });

    // add follower each other
    await prisma.follower.create({
      data: { user_id: userId, follower_id: friendId },
    });
    await prisma.follower.create({
      data: { user_id: friendId, follower_id: userId },
    });

    // remove the friend request
    await prisma.friendRequest.deleteMany({
      where: { receiver_id: userId, sender_id: friendId },
    });

    return NextResponse.json(friend);
  } catch (err) {
    console.log("[USERS_ACCEPT_FRIEND_REQUEST_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
