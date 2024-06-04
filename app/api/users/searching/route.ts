import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");
    const searchKey = url.searchParams.get("searchKey");

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { full_name: { contains: searchKey! } },
          { first_name: { contains: searchKey! } },
          { last_name: { contains: searchKey! } },
        ],
      },
      take: +limit!,
    });

    const groups = await prisma.group.findMany({
      where: { group_name: { contains: searchKey! } },
      take: +limit!,
    });

    return NextResponse.json({ users, groups });
  } catch (err) {
    console.log("[USERS_SEARCH_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
