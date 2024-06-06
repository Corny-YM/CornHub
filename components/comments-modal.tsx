"use client";

import toast from "react-hot-toast";
import { SendHorizontal } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Group, Post, User, File as IFile } from "@prisma/client";
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

interface Props {
  data: Post & { user: User; group: Group | null; file: IFile | null };
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val: boolean) => void;
}

const CommentsModal = ({ data, open, children, onOpenChange }: Props) => {
  const { currentUser } = useAppContext();

  const [inputValue, setInputValue] = useState("");

  const {
    data: commentData,
    isLoading,
    refetch,
  } = useQuery({
    enabled: !!open && !!data.id,
    queryKey: ["post", "comment", data.id],
    queryFn: () => getComments(data.id),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["post", "comments", "store", data.id],
    mutationFn: store,
    onSuccess() {
      refetch();
      setInputValue("");
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

  const handleChange = useCallback((e: ChangeEvent) => {
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
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col">
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
            <div className="flex w-full items-center gap-x-2">
              <AvatarImg src={currentUser.avatar} />
              <Input
                className="flex-1 !ring-0 !ring-offset-0 rounded-full outline-none"
                placeholder="Viết bình luận"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                className={cn(
                  "w-10 h-10 p-0 hover:bg-primary/50 rounded-full",
                  !isDisabled && "bg-primary/50 hover:bg-primary/40"
                )}
                variant="outline"
                size="icon"
              >
                <SendHorizontal size={20} />
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
