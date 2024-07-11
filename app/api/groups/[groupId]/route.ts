import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import { UsedForEnum } from "@/lib/enum";
import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const group = await prisma.group.findFirst({
      include: { owner: true, _count: { select: { groupMembers: true } } },
      where: { id: +params.groupId },
    });

    return NextResponse.json(group);
  } catch (err) {
    console.log("[GROUP_ID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const formData = await req.formData();

    // User
    const cover = formData.get("cover") as File | string | null;
    const group_name = formData.get("group_name") as File | string | null;
    const status = formData.get("status") as string | null;
    const approve_members = formData.get("approve_members") as string | null;
    const approve_posts = formData.get("approve_posts") as string | null;
    const description = formData.get("description") as string | null;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    let group = await prisma.group.findFirstOrThrow({
      where: { id: +params.groupId },
    });

    let fileCoverDB: IFile | null = null;

    if (typeof cover !== "string" && cover) {
      fileCoverDB = await uploadFile({
        userId,
        file: cover,
        group_id: group.id,
        used_for: UsedForEnum.cover,
      });
    }

    const data: Record<string, any> = {};

    // Update user cover img from update File | string
    if (fileCoverDB) data.cover = fileCoverDB.path;
    else if (typeof cover === "string") data.cover = cover;

    if (group_name) data.group_name = group_name;
    if (status) data.status = status === "true";
    if (approve_members) data.approve_members = approve_members === "true";
    if (approve_posts) data.approve_posts = approve_posts === "true";
    if (description) data.description = description;

    group = await prisma.group.update({
      include: { owner: true, _count: { select: { groupMembers: true } } },
      where: { id: group.id },
      data: { ...data },
    });

    return NextResponse.json(group);
  } catch (err) {
    console.log("[GROUP_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const user = await prisma.user.findFirst({
      where: { id: userId, is_admin: true },
    });

    const group = await prisma.group.findFirstOrThrow({
      where: { id: +params.groupId },
    });

    const hasPermission = user?.is_admin || group?.owner_id === userId;

    if (!hasPermission)
      return new NextResponse("You do not have permission", { status: 401 });

    const res = await removeGroup(group.id);

    return NextResponse.json(res);
  } catch (err) {
    console.log("[REPLY_ID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function removeGroup(groupId: number) {
  const groupPost = await prisma.post.findMany({
    include: { file: true },
    where: { group_id: groupId },
  });

  const ids: number[] = [];
  const promiseDelete: Promise<void>[] = [];
  groupPost.forEach((post) => {
    ids.push(post.id);
    const file = post.file;
    if (!file) return;
    const item = deleteFile(file.id, file.path);
    promiseDelete.push(item);
  });

  // Delete group => empty data first
  await prisma.groupMember.deleteMany({ where: { group_id: groupId } });
  await prisma.groupFollower.deleteMany({ where: { group_id: groupId } });
  await prisma.groupRequest.deleteMany({ where: { group_id: groupId } });

  // Delete post => delete reactions, reports, comments, reply, files
  await prisma.notification.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.reaction.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.commentReply.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.comment.deleteMany({ where: { post_id: { in: ids } } });

  await Promise.all(promiseDelete);

  await prisma.post.deleteMany({
    where: { id: { in: ids } },
  });

  const group = await prisma.group.delete({ where: { id: groupId } });
  return group;
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
