import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const followings = await prisma.follower.findMany({
      include: { follower: true, user: true },
      where: { follower_id: params.userId },
    });

    return NextResponse.json(followings);
  } catch (err) {
    console.log("[USER_FOLLOWING_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { followerId }: { followerId: string } = body;

    if (!userId || userId !== params.userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    await prisma.follower.updateMany({
      where: { follower_id: userId, user_id: followerId },
      data: { status: true },
    });

    const follower = await prisma.follower.findFirst({
      where: { follower_id: userId, user_id: followerId },
    });

    return NextResponse.json(follower);
  } catch (err) {
    console.log("[USERS_FOLLOWING_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
