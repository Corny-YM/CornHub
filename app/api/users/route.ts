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

    // User
    const cover = formData.get("cover") as File | string | null;
    const avatar = formData.get("avatar") as File | string | null;
    const last_name = formData.get("last_name") as string | null;
    const first_name = formData.get("first_name") as string | null;
    const full_name = formData.get("full_name") as string | null;

    // User Detail
    const gender = formData.get("gender") as string | null;
    const biography = formData.get("biography") as string | null;
    const work = formData.get("work") as string | null;
    const education = formData.get("education") as string | null;
    const living = formData.get("living") as string | null;
    const country = formData.get("country") as string | null;
    const relationship = formData.get("relationship") as string | null;
    const portfolio = formData.get("portfolio") as string | null;
    const birth = formData.get("birth") as string | null;

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    let fileCoverDB: IFile | null = null;
    let fileAvatarDB: IFile | null = null;

    if (typeof cover !== "string" && cover) {
      fileCoverDB = await uploadFile(cover, userId);
    }
    if (typeof avatar !== "string" && avatar) {
      fileAvatarDB = await uploadFile(avatar, userId);
    }

    const data: Record<string, any> = {};
    const dataUserDetail = {
      gender: gender && !isNaN(+gender) ? +gender : null,
      biography,
      work,
      education,
      living,
      country,
      relationship,
      portfolio,
      birth,
    };

    // Update user cover img from update File | string
    if (fileCoverDB) data.cover = fileCoverDB.path;
    else if (typeof cover === "string") data.cover = cover;

    // Update user avatar img from update File | string
    if (fileAvatarDB) data.avatar = fileAvatarDB.path;
    else if (typeof avatar === "string") data.avatar = avatar;

    if (last_name) data.last_name = last_name;
    if (first_name) data.first_name = first_name;
    if (full_name) data.full_name = full_name;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        userDetails: {
          upsert: {
            where: { user_id: userId },
            update: dataUserDetail,
            create: dataUserDetail,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[REPLIES_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
