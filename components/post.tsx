"use client";

import { cn } from "@/lib/utils";
import PostFooter from "@/components/post-footer";
import PostHeader from "@/components/post-header";
import PostContent from "@/components/post-content";

interface Props {
  className?: string;
}

const PostItem = ({ className }: Props) => {
  return (
    <div className={cn("post-item", className)}>
      {/* Header */}
      <PostHeader />

      {/* Content */}
      <PostContent />

      {/* Footer */}
      <PostFooter />
    </div>
  );
};

export default PostItem;
