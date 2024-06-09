import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { reactionId: number } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.reactionId)
      return new NextResponse("Reaction ID is required", { status: 404 });

    const reaction = await prisma.reaction.findFirst({
      where: { id: +params.reactionId },
    });

    if (!reaction)
      return new NextResponse("Reaction does not exist", { status: 404 });

    if (reaction.user_id !== userId)
      return new NextResponse("You don't have this permission", {
        status: 404,
      });

    const res = await prisma.reaction.deleteMany({
      where: { id: +params.reactionId },
    });

    return NextResponse.json(res);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
