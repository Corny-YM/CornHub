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

    // remove the friend request
    const res = await prisma.friendRequest.deleteMany({
      where: { receiver_id: userId, sender_id: friendId },
    });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[USERS_DENIED_FRIEND_REQUEST_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
