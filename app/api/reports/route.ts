import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const report = await prisma.report.create({
      data: body,
    });

    return NextResponse.json(report);
  } catch (err) {
    console.log("[REPORTS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
