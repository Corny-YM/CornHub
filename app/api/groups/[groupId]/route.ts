import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import uploadFile from "@/services/uploadFile";
import prisma from "@/lib/prisma";
import { UsedForEnum } from "@/lib/enum";
import { File as IFile } from "@prisma/client";

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
