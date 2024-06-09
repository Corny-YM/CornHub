import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { User, File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";
import uploadFile from "@/services/uploadFile";

// STORE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user }: { user: User } = body;

    if (!user || !user.email) {
      return new NextResponse("User email is required", { status: 400 });
    }

    const { last_sign_in } = user;

    const data = await prisma.user.upsert({
      where: { email: user.email },
      // Update the user if it exists
      update: { last_sign_in },
      // Create a new user if it doesn't exist
      create: user,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.log("[USERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const cover = formData.get("cover") as File | null;
    const avatar = formData.get("avatar") as File | null;
    const last_name = formData.get("last_name") as string | null;
    const first_name = formData.get("first_name") as string | null;
    const full_name = formData.get("full_name") as string | null;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const fileCoverDB: IFile | null = await uploadFile(cover, userId);
    const fileAvatarDB: IFile | null = await uploadFile(avatar, userId);

    const data: Record<string, any> = {};

    if (fileCoverDB) data.cover = fileCoverDB.path;
    if (fileAvatarDB) data.cover = fileAvatarDB.path;
    if (last_name) data.last_name = last_name;
    if (first_name) data.first_name = first_name;
    if (full_name) data.full_name = full_name;

    const user = await prisma.user.update({ where: { id: userId }, data });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[REPLIES_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
