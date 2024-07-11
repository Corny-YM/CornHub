import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const { userId } = auth();

    const body: { status: number } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const report = await prisma.report.update({
      where: { id: +params.reportId },
      data: { status: body.status },
    });

    return NextResponse.json(report);
  } catch (err) {
    console.log("[REPORT_ID_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const report = await prisma.report.delete({
      where: { id: +params.reportId },
    });

    return NextResponse.json(report);
  } catch (err) {
    console.log("[REPORT_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
