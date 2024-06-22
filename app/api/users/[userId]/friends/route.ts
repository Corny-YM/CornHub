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
      return new NextResponse("Unauthenticated", { status: 401 });

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const limit = url.searchParams.get("limit");
    const exceptId = url.searchParams.get("exceptId");
    const searchKey = url.searchParams.get("searchKey");
    const conversationId = url.searchParams.get("conversationId");

    let exceptionIds: string[] = [];

    if (exceptId) exceptionIds.push(exceptId);

    // Get all members in that conversation
    if (conversationId) {
      const members = await prisma.conversationMember.findMany({
        where: { conversation_id: conversationId },
      });
      exceptionIds.push(...members.map((mem) => mem.member_id));
    }

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
            friend_id: { notIn: exceptionIds },
          },
          {
            AND: [
              { friend_id: params.userId },
              searchKey ? { user: { full_name: { contains: searchKey } } } : {},
            ],
            user_id: { notIn: exceptionIds },
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
