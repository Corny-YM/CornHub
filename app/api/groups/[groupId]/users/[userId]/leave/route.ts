import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.userId)
      return new NextResponse("User ID is required", { status: 404 });
    if (!params.groupId)
      return new NextResponse("Group ID is required", { status: 404 });

    const group = await prisma.group.findFirst({
      where: { id: +params.groupId },
    });

    if (!group)
      return new NextResponse("Group does not exist", { status: 404 });

    const isAdmin = group.owner_id === params.userId;

    if (isAdmin) await adminLeave(group.id);
    else await memberLeave(group.id, params.userId);

    return NextResponse.json({});
  } catch (err) {
    console.log("[GROUP_USER_LEAVE_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function memberLeave(groupId: number, userId: string) {
  await prisma.groupMember.deleteMany({
    where: { group_id: groupId, member_id: userId },
  });

  await prisma.groupFollower.deleteMany({
    where: { group_id: groupId, follower_id: userId },
  });

  await prisma.groupRequest.deleteMany({
    where: { group_id: groupId, receiver_id: userId },
  });
}

async function adminLeave(groupId: number) {
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
  await prisma.report.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.reaction.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.commentReply.deleteMany({ where: { post_id: { in: ids } } });
  await prisma.comment.deleteMany({ where: { post_id: { in: ids } } });

  await Promise.all(promiseDelete);

  await prisma.post.deleteMany({
    where: { id: { in: ids } },
  });

  await prisma.group.delete({ where: { id: groupId } });
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
