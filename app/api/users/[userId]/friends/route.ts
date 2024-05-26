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
    const exceptId = url.searchParams.get("exceptId");

    const friends = await prisma.friend.findMany({
      include: { user: true, friend: true },
      where: {
        OR: [
          {
            AND: [
              { user_id: params.userId },
              searchKey
                ? { friend: { full_name: { contains: searchKey } } }
                : {},
            ],
            NOT: exceptId ? [{ friend_id: exceptId! }] : [],
          },
          {
            AND: [
              { friend_id: params.userId },
              searchKey ? { user: { full_name: { contains: searchKey } } } : {},
            ],
            NOT: exceptId ? [{ user_id: exceptId! }] : [],
          },
        ],
      },
      ...(limit && !isNaN(+limit) ? { take: +limit } : {}),
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
