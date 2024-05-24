import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, status }: { name: string; status: string } = body;
    const { userId } = auth();
    if (!userId) return new NextResponse("Authenticated", { status: 401 });

    const group = await prisma.group.create({
      data: {
        group_name: name,
        status: !!+status,
        owner_id: userId,
      },
    });

    return NextResponse.json(group);
  } catch (err) {
    console.log("[GROUPS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
