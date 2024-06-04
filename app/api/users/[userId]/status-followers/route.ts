import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId || userId !== params.userId)
      return new NextResponse("Unauthenticated", { status: 401 });

    const followers = await prisma.follower.findMany({
      where: {
        OR: [{ user_id: params.userId }, { follower_id: params.userId }],
      },
    });

    return NextResponse.json(followers);
  } catch (err) {
    console.log("[USER_STATUS_FOLLOWER_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
