import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");

    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const groupMembers = await prisma.groupMember.findMany({
      include: { member: true },
      where: { group_id: +params.groupId },
      take: limit && !isNaN(+limit) ? +limit : undefined,
      orderBy: { created_at: "desc" },
    });

    const members = groupMembers.map((item) => item.member);

    return NextResponse.json(members);
  } catch (err) {
    console.log("[GROUP_MEMBERS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
