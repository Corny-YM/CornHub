"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Comment, User, File as IFile } from "@prisma/client";

import Video from "@/components/video";

interface Props {
  data: Comment & { user: User; file?: IFile | null };
}

const Content = ({ data }: Props) => {
  const { user, file, content } = data;

  const type = useMemo(() => {
    if (!file) return;
    return `${file.type}/${file.ext}`;
  }, [file]);
  const path = useMemo(() => {
    if (!file) return;
    return file.path;
  }, [file]);

  const isVideo = useMemo(() => {
    const checked = file?.type === "video";
    return checked;
  }, [file]);

  const contentFile = useMemo(() => {
    if (!path || !file) return null;
    if (isVideo && type) return <Video src={path} type={type} />;
    return (
      <Image
        className="absolute w-full h-full"
        alt={file.name}
        src={path}
        fill
      />
    );
  }, [isVideo, type, file, path]);

  return (
    <div className="max-w-full w-fit h-fit px-3 py-2 rounded-lg bg-primary-foreground/50 leading-normal">
      <Link className="font-bold hover:underline" href={`/account/${user.id}`}>
        {user.full_name}
      </Link>
      <div className="max-w-full break-words">{content}</div>
      <div className="w-full">
        <div className="w-full relative flex justify-center items-center">
          {contentFile}
        </div>
      </div>
    </div>
  );
};

export default Content;
