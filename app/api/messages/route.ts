import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile, Message } from "@prisma/client";

import { TypeMessageEnum, UsedForEnum } from "@/lib/enum";
import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") as string;
    const conversationId = searchParams.get("conversationId") as string;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!conversationId)
      return new NextResponse("Conversation ID missing", { status: 400 });

    let messages: Message[] = [];

    const include = {
      sender: true,
      file: true,
      messageReactions: true,
      _count: { select: { messageReactions: true } },
    };

    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: { id: +cursor },
        where: { conversation_id: conversationId },
        include: include,
        orderBy: { created_at: "desc" },
      });
    } else {
      messages = await prisma.message.findMany({
        take: MESSAGE_BATCH,
        where: { conversation_id: conversationId },
        include: include,
        orderBy: { created_at: "desc" },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    console.log("[MESSAGES_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function PUT(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;
//     const content = formData.get("content") as string;
//     const conversationId = formData.get("conversationId") as string;

//     const { userId } = auth();
//     if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

//     if (!conversationId)
//       return new NextResponse("Conversation ID is required", { status: 404 });

//     const conversation = await prisma.conversation.findFirst({
//       where: { id: conversationId },
//     });
//     if (!conversation)
//       return new NextResponse("Conversation does not exist", { status: 404 });

//     const fileDB: IFile | null = await uploadFile({
//       file,
//       userId,
//       used_for: UsedForEnum.message,
//     });

//     const comment = await prisma.message.create({
//       data: {
//         conversation_id: conversation.id,
//         sender_id: userId,
//         file_id: fileDB?.id,
//         content: content,
//         type: fileDB?.id ? TypeMessageEnum.file : TypeMessageEnum.message,
//       },
//     });

//     return NextResponse.json(comment);
//   } catch (err) {
//     console.log("[MESSAGE_PUT]", err);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
