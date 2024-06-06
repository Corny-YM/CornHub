"use client";

import { Comment, User, Post, Group, File as IFile } from "@prisma/client";

import { cn, getRelativeTime } from "@/lib/utils";
import AvatarImg from "@/components/avatar-img";
import Actions from "./actions";
import Content from "./content";

interface Props {
  className?: string;
  data: Comment & {
    user: User;
    file?: IFile | null;
    _count: { reacts: number; commentReplies: number };
  };
  dataPost: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
  };
}

const CommentItem = ({ data, dataPost, className }: Props) => {
  const { user, created_at, _count } = data;

  return (
    <div className={cn("w-full flex flex-col px-2 pt-1", className)}>
      <div className="w-full h-fit flex items-start group">
        <AvatarImg src={user.avatar!} className="mr-2" />

        <div className="w-full flex flex-col">
          <div className="w-fit flex items-center gap-1">
            {/* Content */}
            <Content data={data} />

            {/* Actions */}
            <div className="group-hover:opacity-100 opacity-0 h-full flex-grow flex-shrink flex justify-center items-center transition">
              <Actions data={data} dataPost={dataPost} />
            </div>
          </div>

          {/* Interactions */}
          <div className="w-full flex items-center gap-x-4 text-xs px-2">
            <div>{getRelativeTime(created_at, false)}</div>
            <div className="cursor-pointer hover:underline">Thích</div>
            <div className="cursor-pointer hover:underline">Phản hồi</div>
            {_count.reacts >= 3 && <div>tuowng tac comment</div>}
          </div>

          {!_count.commentReplies && (
            <div className="cursor-pointer hover:underline px-1">
              15 phản hồi
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
