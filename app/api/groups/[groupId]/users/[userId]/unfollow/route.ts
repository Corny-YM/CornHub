import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Authenticated", { status: 401 });

    if (!params.userId)
      return new NextResponse("User ID is required", { status: 404 });
    if (!params.groupId)
      return new NextResponse("Group ID is required", { status: 404 });

    const group = await prisma.group.findFirst({
      where: { id: +params.groupId },
    });

    if (!group)
      return new NextResponse("Group does not exist", { status: 404 });

    await prisma.groupFollower.updateMany({
      where: { group_id: group.id, follower_id: params.userId },
      data: { status: false },
    });

    return NextResponse.json({});
  } catch (err) {
    console.log("[GROUP_USER_UNFOLLOW_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
