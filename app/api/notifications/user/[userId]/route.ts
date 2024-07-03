import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const notifications = await prisma.notification.findMany({
      include: {
        post: true,
        group: true,
        reply: true,
        sender: true,
        comment: true,
      },
      where: { receiver_id: params.userId },
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.log("[NOTIFICATIONS_USER_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
