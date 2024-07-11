import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const user = await prisma.user.update({
      where: { id: body.userId },
      data: { is_banned: false },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[ADMIN_BAN_USER_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
