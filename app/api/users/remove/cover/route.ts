import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 400 });

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) return new NextResponse("User does not exist", { status: 404 });

    if (!user.cover) return NextResponse.json(user);

    // Remove the char "/" from path user cover
    const file = await prisma.file.findFirst({
      where: { path: { contains: user.cover.substring(1) } },
    });

    if (!file) return new NextResponse("File does not exist", { status: 404 });

    try {
      const filePath = path.join(process.cwd(), "public", user.cover);
      await fs.unlink(filePath);
      await prisma.file.deleteMany({ where: { id: file.id } });

      // Update user when delete file successful
      await prisma.user.update({
        where: { id: user.id },
        data: { cover: null },
      });
    } catch (error) {
      console.log("[FILE_DELETE_ERROR]", error);
      // Handle error, e.g., file might not exist, log it, etc.
    }

    return NextResponse.json(user);
  } catch (err) {
    console.log("[USERS_REMOVE_COVER_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
