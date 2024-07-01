"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Group, Post, User, File as IFile } from "@prisma/client";

import { emotionIcons, emotions } from "@/lib/const";
import { cn, formatAmounts } from "@/lib/utils";
import { getAllReactionTypes, index } from "@/actions/reactions";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import Loading from "./icons/loading";
import EmptyData from "./empty-data";
import AvatarImg from "./avatar-img";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface Props {
  data: Post & { user: User; group: Group | null; file: IFile | null };
  commentId?: number;
  replyId?: number;
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val?: boolean) => void;
}

const defaultType = "all";

const ReactionsModal = ({
  data,
  commentId,
  replyId,
  open,
  children,
  onOpenChange,
}: Props) => {
  const [currentType, setCurrentType] = useState(defaultType);
  const dynamicKeys = [data.id, commentId, replyId];

  // Get all type of reactions that post had
  const { data: dataReactionTypes, isLoading: isLoadingReactionTypes } =
    useQuery({
      enabled: !!data.id && open,
      queryKey: ["post", "types", "reactions", ...dynamicKeys],
      queryFn: () =>
        getAllReactionTypes({ postId: data.id, commentId, replyId }),
    });

  // Get all reactions of currentType
  const { data: dataReactions, isLoading: isLoadingReactions } = useQuery({
    enabled: !!data.id && open,
    queryKey: ["post", "getReactions", currentType, ...dynamicKeys],
    queryFn: () =>
      index({ postId: data.id, commentId, replyId, type: currentType }),
  });

  const handleOpenChange = useCallback(
    (val?: boolean) => {
      setCurrentType(defaultType);
      onOpenChange?.(val);
    },
    [onOpenChange]
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    const type = target.dataset.type;
    if (!type) return;
    setCurrentType(type);
  }, []);

  const contentTitle = useMemo(() => {
    if (isLoadingReactionTypes)
      return (
        <div className="flex items-center gap-x-2">
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
        </div>
      );
    if (!dataReactionTypes || !dataReactionTypes.length) return null;
    return dataReactionTypes.map((reactionType) => {
      const { type, _count } = reactionType;
      const emotion = emotions.find((emo) => emo.type === type);
      if (!emotion) return null;
      const { color, icon: Icon } = emotion;
      return (
        <Button
          key={type}
          className={cn(
            currentType === type &&
              "bg-primary hover:bg-primary dark:bg-primary-foreground dark:hover:bg-primary-foreground/90"
          )}
          data-type={type}
          variant="outline"
          onClick={handleClick}
        >
          <div className="w-5 h-5 flex justify-center items-center mr-2">
            <Icon />
          </div>
          <div style={{ color }}>{formatAmounts(+_count._all)}</div>
        </Button>
      );
    });
  }, [dataReactionTypes, isLoadingReactionTypes, currentType, handleClick]);

  const content = useMemo(() => {
    if (isLoadingReactions)
      return (
        <div className="py-2 w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!dataReactions || !dataReactions.length) return <EmptyData />;
    return dataReactions.map((reaction) => {
      const { id, user, type } = reaction;
      const Icon = emotionIcons[type];
      return (
        <div
          key={id}
          className="p-2 w-full flex items-center gap-1 justify-between"
        >
          <div className="flex items-center">
            <AvatarImg src={user.avatar} className="mr-2" />
            <Link
              className="w-fit hover:underline"
              href={`/account/${user.id}`}
            >
              {user.full_name}
            </Link>
          </div>
          <div className="w-6 h-6 flex justify-center items-center">
            <Icon />
          </div>
        </div>
      );
    });
  }, [dataReactions, isLoadingReactions]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>
            <ScrollArea className="w-[calc(100%-20px)] pb-3">
              <div className="w-full flex gap-2 items-center">
                <Button
                  className={cn(
                    currentType === defaultType &&
                      "bg-primary hover:bg-primary dark:bg-primary-foreground dark:hover:bg-primary-foreground/90"
                  )}
                  data-type={defaultType}
                  variant="outline"
                  onClick={handleClick}
                >
                  Tất cả
                </Button>
                {contentTitle}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 h-full flex flex-col">
          <ScrollArea className="flex-1 max-h-[600px] -mx-6 px-6">
            {content}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactionsModal;
