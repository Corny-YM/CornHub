"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Group, Post, User, File as IFile, Reaction } from "@prisma/client";

import { getComments } from "@/actions/post";
import { useAppContext } from "@/providers/app-provider";
import { useMutates } from "@/hooks/mutations/comment/useMutates";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import PostItem from "@/components/post";
import EmptyData from "@/components/empty-data";
import CommentItem from "@/components/comments";
import Loading from "@/components/icons/loading";
import UserInputSending from "@/components/user-input-sending";

interface Props {
  data: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
    reactions: Reaction[];
    _count: { comments: number; reactions: number };
  };
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val: boolean) => void;
}

const CommentsModal = ({ data, open, children, onOpenChange }: Props) => {
  const { currentUser } = useAppContext();

  const { isPendingStoreComment, onStore } = useMutates();

  const {
    data: commentData,
    isLoading,
    refetch,
  } = useQuery({
    enabled: !!open && !!data.id && !!currentUser,
    queryKey: ["post", "comment", data.id, currentUser?.id],
    queryFn: () => getComments(data.id),
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex items-center justify-center">
          <Loading />
        </div>
      );
    if (!commentData || !commentData.length) return <EmptyData />;
    return commentData.map((item) => {
      return <CommentItem key={item.id} data={item} dataPost={data} />;
    });
  }, [commentData, isLoading]);

  const handleClickSend = useCallback(
    async (inputData: { value: string }) => {
      if (!currentUser) return;
      await onStore({ postId: data.id, content: inputData.value }, () => {
        refetch();
      });
    },
    [currentUser, data, onStore]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-x-2 select-none">
              Bài viết của <Badge>{data.user.full_name}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="h-full flex flex-col overflow-hidden overflow-y-auto">
          <ScrollArea className="max-h-full -mx-6 px-6">
            {/* Content */}
            <PostItem data={data} isModal />

            {/* Comments */}
            <div className="w-full">{content}</div>
          </ScrollArea>
        </div>

        {currentUser && (
          <DialogFooter>
            <UserInputSending
              disabled={isPendingStoreComment}
              onSend={handleClickSend}
            />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
