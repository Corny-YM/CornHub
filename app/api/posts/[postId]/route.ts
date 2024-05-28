import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const post = await prisma;

    return NextResponse.json({});
  } catch (err) {
    console.log("[POST_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
