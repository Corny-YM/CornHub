import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    const friendRequest = await prisma.friendRequest.create({
      include: { sender: true, receiver: true },
      data: { sender_id: userId, receiver_id: friendId },
    });

    return NextResponse.json(friendRequest);
  } catch (err) {
    console.log("[USERS_ADD_FRIEND_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
