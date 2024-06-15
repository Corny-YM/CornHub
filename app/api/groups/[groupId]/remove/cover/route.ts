import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    let group = await prisma.group.findFirstOrThrow({
      where: { id: +params.groupId },
    });

    if (!group)
      return new NextResponse("Group does not exist", { status: 404 });

    if (!group?.cover) return NextResponse.json(group);

    const file = await prisma.file.findFirst({
      where: { path: { contains: group.cover }, user_id: userId },
    });

    if (!file) return new NextResponse("File does not exist", { status: 404 });

    // try {
    //   const filePath = path.join(process.cwd(), "public", user.cover);
    //   await fs.unlink(filePath);
    //   await prisma.file.deleteMany({ where: { id: file.id } });
    // } catch (error) {
    //   console.log("[FILE_DELETE_ERROR]", error);
    //   // Handle error, e.g., file might not exist, log it, etc.
    // }

    // Update user when delete file successful
    group = await prisma.group.update({
      where: { id: group.id },
      data: { cover: null },
    });

    return NextResponse.json(group);
  } catch (err) {
    console.log("[GROUP_COVER_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
