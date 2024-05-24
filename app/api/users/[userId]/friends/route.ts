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
    const searchKey = url.searchParams.get("searchKey");

    const condition: Record<string, any> = {};

    const args: any = {
      include: { user: true, friend: true },
      where: condition,
    };

    if (limit) args.take = +limit;
    if (searchKey) condition.full_name = { contains: searchKey };

    // TODO: searching for friend's name
    const friends = await prisma.friend.findMany({
      include: { user: true, friend: true },
      where: {
        OR: [{ user_id: params.userId }, { friend_id: params.userId }],
      },
    });

    const totalFriends = await prisma.friend.count({
      where: {
        OR: [{ user_id: params.userId }, { friend_id: params.userId }],
      },
    });

    return NextResponse.json({ friends, totalFriends });
  } catch (err) {
    console.log("[USER_FRIENDS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
