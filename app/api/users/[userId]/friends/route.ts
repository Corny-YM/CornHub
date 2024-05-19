import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId)
      return new NextResponse("Authenticated", { status: 401 });

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const limit = url.searchParams.get("limit");

    const condition = {
      OR: [{ user_id: params.userId }, { friend_id: params.userId }],
    };

    const args: any = {
      include: { user: true, friend: true },
      where: condition,
    };

    if (limit) args.take = +limit;

    const friends = await prisma.friend.findMany(args);

    const totalFriends = await prisma.friend.count({
      where: condition,
    });

    return NextResponse.json({ friends, totalFriends });
  } catch (err) {
    console.log("[USER_FRIENDS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
