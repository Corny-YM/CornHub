import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body: { userId: string } = await req.json();

    await prisma.groupFollower.deleteMany({
      where: { group_id: +params.groupId, follower_id: body.userId },
    });
    const groupMember = await prisma.groupMember.deleteMany({
      where: { group_id: +params.groupId, member_id: body.userId },
    });

    return NextResponse.json(groupMember);
  } catch (err) {
    console.log("[GROUPS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
