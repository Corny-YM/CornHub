import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import sendNotification from "@/services/sendNotification";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      ids,
      groupId,
    }: {
      ids: string[];
      groupId: number;
    } = body;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const data: { sender_id: string; receiver_id: string; group_id: number }[] =
      [];
    const promiseSendNotifications: Promise<void>[] = [];

    ids.forEach((id) => {
      data.push({
        sender_id: userId,
        receiver_id: id,
        group_id: groupId,
      });
      promiseSendNotifications.push(
        sendNotification({ type: "group", receiver_id: id, group_id: groupId })
      );
    });

    const res = await prisma.groupRequest.createMany({
      data,
      skipDuplicates: true,
    });

    await Promise.allSettled(promiseSendNotifications);

    return NextResponse.json(res);
  } catch (err) {
    console.log("[GROUPS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
