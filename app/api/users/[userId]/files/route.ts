import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();

    const url = new URL(req.url);
    const type = url.searchParams.get("type") as string;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const files = await prisma.file.findMany({
      where: { user_id: params.userId, ...(type && { type }) },
    });

    return NextResponse.json(files);
  } catch (err) {
    console.log("[USERS_FILES_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
