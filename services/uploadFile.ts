import fs from "node:fs/promises";
import { File as IFile } from "@prisma/client";
import prisma from "@/lib/prisma";
import { UsedForEnum } from "@/lib/enum";

type Return = IFile | null;

interface IData {
  file: File | null;
  userId: string;
  used_for?: UsedForEnum;
  group_id?: number;
}

export default async function (data: IData): Promise<Return> {
  const { userId, file, used_for, group_id } = data;

  let fileDB: IFile | null = null;
  if (!file) return fileDB;

  const types = file.type.split("/");
  const fileType = types?.[0] || "image";
  const fileExtension = types?.[1] || "tmp";
  const fileName = `${new Date().getTime()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const pathDir = `uploads/${userId}/${fileType}`;
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
      user_id: userId,
      actual_name: file.name,
      path: `/${pathDir}/${fileName}`,
      used_for,
      group_id,
    },
  });

  return fileDB;
}
