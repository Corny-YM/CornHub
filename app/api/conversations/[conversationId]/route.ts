import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export async function PUT(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const sender = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const fileDB: IFile | null = await uploadFile({ file, userId: userId });

    let lastMessage = `${sender.full_name} đã thay đổi tên đoạn chat`;

    if (fileDB) {
      lastMessage = `${sender.full_name} đã thay đổi ảnh nhóm`;
    }

    const conversation = await prisma.conversation.update({
      include: { file: true, createdBy: true, user: true },
      where: { id: params.conversationId },
      data: {
        name,
        file_id: fileDB?.id,
        active: 1,
        last_message: lastMessage,
        last_time_online: new Date(),
      },
    });

    const members = await prisma.conversationMember.findMany({
      where: { conversation_id: conversation.id },
    });
    members.forEach((mem) => {
      global.io.emit(`conversation:${conversation.id}`, conversation);
      global.io.emit(`${mem.member_id}:conversation:list:update`, conversation);
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATION_ID_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const conversation = await prisma.conversation.findFirstOrThrow({
      include: {
        file: true,
        user: true,
        createdBy: true,
        conversationMembers: true,
      },
      where: { id: params.conversationId },
    });
    const members = conversation.conversationMembers;

    const isOwner = conversation.created_by === userId;
    if (!isOwner)
      return new NextResponse("You don't have permission", { status: 403 });

    // DELETE conversation =>
    const messages = await prisma.message.findMany({
      include: { file: true },
      where: { conversation_id: conversation.id },
    });

    const messageIds: number[] = [];
    const promiseDeleteFiles: Promise<void>[] = [];
    messages.forEach((message) => {
      messageIds.push(message.id);
      if (!message.file) return;
      const item = deleteFile(message.file.id, message.file.path);
      promiseDeleteFiles.push(item);
    });
    await prisma.messageReaction.deleteMany({
      where: { message_id: { in: messageIds } },
    });
    await prisma.message.deleteMany({ where: { id: { in: messageIds } } });
    await Promise.all(promiseDeleteFiles);

    await prisma.conversationMember.deleteMany({
      where: { conversation_id: conversation.id },
    });
    await prisma.conversation.delete({ where: { id: conversation.id } });

    members.forEach((mem) => {
      global.io.emit(`conversation:${conversation.id}`, conversation);
      global.io.emit(`${mem.member_id}:conversation:list:update`, {
        ...conversation,
        member_leaved: mem.member_id,
        member_deleted: mem.member_id,
      });
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log("[CONVERSATION_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function deleteFile(id: number, url: string) {
  try {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath);
    await prisma.file.deleteMany({ where: { id: id } });
  } catch (error) {
    console.log("[FILE_DELETE_ERROR]", error);
    // Handle error, e.g., file might not exist, log it, etc.
  }
}
