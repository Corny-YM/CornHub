import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import sendNotification from "@/services/sendNotification";

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

    await sendNotification({
      type: "friend",
      receiver_id: friendId,
    });

    return NextResponse.json(friendRequest);
  } catch (err) {
    console.log("[USERS_ADD_FRIEND_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    const body: { friendId: string } = await req.json();
    const { friendId } = body;

    if (!userId || userId !== params.userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const res = await prisma.friendRequest.deleteMany({
      where: { sender_id: userId, receiver_id: friendId },
    });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[USERS_REQUEST_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
