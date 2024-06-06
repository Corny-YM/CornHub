"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Comment, User, File as IFile } from "@prisma/client";

import { cn } from "@/lib/utils";
import Video from "@/components/video";
import AvatarImg from "@/components/avatar-img";
import Image from "next/image";

type CommentWithInfo = Comment & { user: User; file?: IFile | null };

interface Props {
  className?: string;
  data: CommentWithInfo;
}

const CommentItem = ({ data, className }: Props) => {
  const { user, file, content, comment_id } = data;

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
    <div className={cn("w-full flex flex-col px-2 pt-1", className)}>
      <div className="w-full flex items-start">
        <AvatarImg src={user.avatar!} className="mr-2" />
        {/* Content comment */}
        <div className="w-full h-fit px-3 py-2 rounded-lg bg-primary-foreground/50 leading-normal">
          <Link
            className="font-bold hover:underline"
            href={`/account/${user.id}`}
          >
            {user.full_name}
          </Link>
          <div className="w-full break-words">{content}</div>
          <div className="w-full">
            <div className="w-full relative flex justify-center items-center">
              {contentFile}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
