"use client";

import { Group, Post, User, File as IFile } from "@prisma/client";

import { cn } from "@/lib/utils";
import PostFooter from "@/components/post-footer";
import PostHeader from "@/components/post-header";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  className?: string;
  isGroupOwner?: boolean;
  isGroupOwnerPost?: boolean;
  data: Post & { user: User; group: Group | null; file: IFile | null };
}

const PostItem = ({
  data,
  className,
  isGroupOwner,
  isGroupOwnerPost,
}: Props) => {
  const file = useMemo(() => data.file, [data]);
  const type = useMemo(() => file?.type, [file]);
  const path = useMemo(() => {
    const tmp = file?.path;
    if (!tmp) return;
    return tmp?.[0] === "/" ? tmp : `/${tmp}`;
  }, [file]);

  return (
    <div className={cn("post-item", className)}>
      {/* Header */}
      <PostHeader
        isGroupOwner={isGroupOwner}
        isGroupOwnerPost={isGroupOwnerPost}
        data={data}
      />

      {/* Content */}
      <div className="flex flex-col w-full text-sm">
        {/* content */}
        <div
          className="px-4 pb-4 pt-1"
          dangerouslySetInnerHTML={{ __html: data.content || "" }}
        />

        {file && path && (
          <div className="flex w-full px-12 bg-primary-foreground/40 mb-2">
            <div className="relative w-full aspect-square flex justify-center items-center">
              {type === "image" && (
                <Image
                  className="absolute w-full h-full object-cover"
                  src={path}
                  alt={data.file?.name || `post-img-${data.id}`}
                  fill
                />
              )}
              {type === "video" && (
                <video
                  className="absolute w-full h-full object-cover"
                  preload="auto"
                  controls
                >
                  <source src={path} type={`${file.type}/${file.ext}`} />
                </video>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <PostFooter data={data} />
    </div>
  );
};

export default PostItem;
