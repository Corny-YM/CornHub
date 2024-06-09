import path from "path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();
    if (!userId || !clerkUser)
      return new NextResponse("Unauthenticated", { status: 400 });

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) return new NextResponse("User does not exist", { status: 404 });

    if (!user.avatar) return NextResponse.json(user);

    const file = await prisma.file.findFirst({
      where: { path: { contains: user.avatar }, user_id: userId },
    });

    if (!file) return new NextResponse("File does not exist", { status: 404 });

    // try {
    //   const filePath = path.join(process.cwd(), "public", user.avatar);
    //   await fs.unlink(filePath);
    //   await prisma.file.deleteMany({ where: { id: file.id } });
    // } catch (error) {
    //   console.log("[FILE_DELETE_ERROR]", error);
    //   // Handle error, e.g., file might not exist, log it, etc.
    // }

    // Update user when delete file successful
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: clerkUser.imageUrl }, // reset to default img from clerk
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[USERS_REMOVE_AVATAR_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
