"use client";

import { Group, Post, User } from "@prisma/client";

import { cn } from "@/lib/utils";
import PostFooter from "@/components/post-footer";
import PostHeader from "@/components/post-header";

interface Props {
  className?: string;
  data: Post & { user: User; group: Group | null };
}

const PostItem = ({ className, data }: Props) => {
  console.log(data);
  return (
    <div className={cn("post-item", className)}>
      {/* Header */}
      <PostHeader data={data} />

      {/* Content */}
      <div className="flex flex-col w-full text-sm">
        <div
          className="px-4 pb-4 pt-1"
          dangerouslySetInnerHTML={{ __html: data.content || "" }}
        />
      </div>

      {/* Footer */}
      <PostFooter data={data} />
    </div>
  );
};

export default PostItem;
