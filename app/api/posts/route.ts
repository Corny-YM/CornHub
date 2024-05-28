import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { File as IFile } from "@prisma/client";

import prisma from "@/lib/prisma";

interface IBody {
  groupId?: number;
  userId: string;
  type?: number;
  status: string;
  content: string;
  file?: File;
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const status = formData.get("status") as string;
    const content = formData.get("content") as string;
    const groupId = formData.get("groupId") as string;

    const { userId: userServerId } = auth();
    if (!userServerId || !userId || userServerId !== userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    let fileDB: IFile | null = null;
    if (file) {
      const types = file.type.split("/");
      const fileType = types?.[0] || "image";
      const fileExtension = types?.[1] || "tmp";
      const fileName = `${new Date().getTime()}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const pathDir = `uploads/${userServerId}/${fileType}`;
      const uploadDir = `./public/${pathDir}`;
      const filePath = `${uploadDir}/${fileName}`;

      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      // Write the file to the specified path
      await fs.writeFile(filePath, buffer);

      // Create file record
      fileDB = await prisma.file.create({
        data: {
          type: fileType,
          name: fileName,
          size: file.size,
          ext: fileExtension,
          user_id: userServerId,
          actual_name: file.name,
          path: `${pathDir}/${fileName}`,
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        status,
        content,
        user_id: userServerId,
        group_id: groupId ? +groupId : null,
        file_id: fileDB ? fileDB.id : null,
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.log("[USERS_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
