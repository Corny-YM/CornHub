import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.userId)
      return new NextResponse("User ID is required", { status: 404 });
    if (!params.groupId)
      return new NextResponse("Group ID is required", { status: 404 });

    const group = await prisma.group.findFirst({
      where: { id: +params.groupId },
    });

    if (!group)
      return new NextResponse("Group does not exist", { status: 404 });

    if (group.approve_members)
      return new NextResponse(
        "Invalid action. Group is on approve member mode",
        { status: 409 }
      );

    await prisma.groupMember.create({
      data: { group_id: group.id, member_id: params.userId },
    });

    await prisma.groupFollower.create({
      data: { group_id: group.id, follower_id: params.userId },
    });

    await prisma.groupRequest.deleteMany({
      where: { group_id: group.id, receiver_id: params.userId },
    });

    return NextResponse.json({});
  } catch (err) {
    console.log("[GROUP_USER_JOIN_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
