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

    const friends = await prisma.friend.findMany({
      include: { user: true, friend: true },
      where: { OR: [{ user_id: params.userId }, { friend_id: params.userId }] },
    });

    return NextResponse.json(friends);
  } catch (err) {
    console.log("[USER_FRIENDS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}