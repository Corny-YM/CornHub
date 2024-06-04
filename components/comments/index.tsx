"use client";

import Link from "next/link";
import { Comment, User, File as IFile } from "@prisma/client";

import { cn } from "@/lib/utils";
import AvatarImg from "@/components/avatar-img";

type CommentWithInfo = Comment & { user: User; file?: IFile };

interface Props {
  className?: string;
  data: CommentWithInfo;
}

const CommentItem = ({ data, className }: Props) => {
  return (
    <div className={cn("w-full flex flex-col px-2 pt-1", className)}>
      <div className="w-full flex items-start">
        <AvatarImg src={data.user.avatar!} className="mr-2" />
        {/* Content comment */}
        <div className="w-full h-fit px-3 py-2 rounded-lg bg-primary-foreground/50 leading-normal">
          <Link href={`/account/${data.user.id}`} className="font-bold">
            {data.user.full_name}
          </Link>
          <div className="w-full break-words">{data.content}</div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
