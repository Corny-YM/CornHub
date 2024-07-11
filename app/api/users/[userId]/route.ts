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

    const user = await prisma.user.findFirst({
      include: { userDetails: true },
      where: { id: params.userId },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[POST_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
