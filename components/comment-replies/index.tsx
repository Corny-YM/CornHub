"use client";

import {
  User,
  Post,
  Group,
  Comment,
  Reaction,
  File as IFile,
} from "@prisma/client";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getReplies } from "@/actions/comments";
import Loading from "../icons/loading";
import EmptyData from "../empty-data";
import CommentRepliesItem from "./item";

interface Props {
  children: React.ReactNode;
  dataComment: Comment & {
    user: User;
    file?: IFile | null;
    reactions: Reaction[];
    _count: { reactions: number };
  };
  dataPost: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
  };
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const CommentRepliesList = ({
  open,
  children,
  dataPost,
  dataComment,
  onOpenChange,
}: Props) => {
  const { userId } = useAuth();

  const { data: commentReplyData, isLoading } = useQuery({
    enabled: !!userId && open,
    queryKey: ["comment", "replies", dataPost.id, dataComment.id, userId],
    queryFn: () =>
      getReplies({ commentId: dataComment.id, postId: dataPost.id }),
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="py-2 w-full flex items-center justify-center">
          <Loading />
        </div>
      );
    if (!commentReplyData || !commentReplyData.length) return <EmptyData />;

    return commentReplyData.map((reply) => (
      <CommentRepliesItem
        key={reply.id}
        data={reply}
        dataPost={dataPost}
        dataComment={dataComment}
      />
    ));
  }, [dataComment, dataPost, commentReplyData, isLoading]);

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>{children}</CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">{content}</CollapsibleContent>
    </Collapsible>
  );
};

export default CommentRepliesList;
