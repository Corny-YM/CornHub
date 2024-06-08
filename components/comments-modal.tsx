"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SendHorizontal } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Group, Post, User, File as IFile, Reaction } from "@prisma/client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { store } from "@/actions/comments";
import { getComments } from "@/actions/post";
import { useAppContext } from "@/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import AvatarImg from "@/components/avatar-img";
import EmptyData from "@/components/empty-data";
import CommentItem from "@/components/comments";
import Loading from "@/components/icons/loading";
import UserInputSending from "./user-input-sending";

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
  const router = useRouter();
  const { currentUser } = useAppContext();

  const [inputValue, setInputValue] = useState("");

  const {
    data: commentData,
    isLoading,
    refetch,
  } = useQuery({
    enabled: !!open && !!data.id && !!currentUser,
    queryKey: ["post", "comment", data.id, currentUser?.id],
    queryFn: () => getComments(data.id),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["post", "comments", "store", data.id],
    mutationFn: store,
    onSuccess() {
      refetch();
      setInputValue("");
      router.refresh();
      toast.success("Bình luận bài viết thành công");
    },
    onError() {
      toast.error("Bình luận bài viết thất bại. Vui lòng thử lại sau");
    },
  });

  const isDisabled = useMemo(
    () => !inputValue.trim() || isPending,
    [inputValue, isPending]
  );

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    setInputValue(val);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key.toLowerCase() !== "enter" || isDisabled || !currentUser) return;
      console.log(inputValue);
      mutate({
        postId: data.id,
        content: inputValue,
      });
    },
    [inputValue, isDisabled, currentUser, data]
  );

  const handleClickSend = useCallback(() => {
    if (!currentUser) return;
    mutate({
      postId: data.id,
      content: inputValue,
    });
  }, [inputValue, currentUser, data]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-x-2 select-none">
              Bài viết của <Badge>{data.user.full_name}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 h-ful flex flex-col">
          <ScrollArea className="flex-1 max-h-[600px] -mx-6 px-6">
            {/* Content */}
            <PostItem data={data} isModal />

            {/* Comments */}
            <div className="w-full">{content}</div>
          </ScrollArea>
        </div>

        {currentUser && (
          <DialogFooter>
            <UserInputSending
              value={inputValue}
              disabled={isDisabled}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onSend={handleClickSend}
            />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
