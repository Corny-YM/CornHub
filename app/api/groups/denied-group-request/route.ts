import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { groupId }: { groupId: number } = body;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!groupId)
      return new NextResponse("Group ID is required", { status: 404 });

    await prisma.groupRequest.deleteMany({
      where: { group_id: groupId, receiver_id: userId },
    });

    return NextResponse.json({});
  } catch (err) {
    console.log("[GROUPS_DENIED_REQUEST_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
