import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Authenticated", { status: 401 });

    const followings = await prisma.follower.findMany({
      include: { follower: true, user: true },
      where: { user_id: params.userId },
    });

    return NextResponse.json(followings);
  } catch (err) {
    console.log("[USER_FOLLOWING_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
