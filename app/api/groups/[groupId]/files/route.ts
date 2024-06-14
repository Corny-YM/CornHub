import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const files = await prisma.file.findMany({
      where: { group_id: +params.groupId, ...(type && { type }) },
    });

    return NextResponse.json(files);
  } catch (err) {
    console.log("[GROUP_FILES_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
