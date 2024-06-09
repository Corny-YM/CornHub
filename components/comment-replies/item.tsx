"use client";

import {
  User,
  Post,
  Group,
  Comment,
  Reaction,
  File as IFile,
  CommentReply,
} from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { emotions } from "@/lib/const";
import { cn, getRelativeTime } from "@/lib/utils";
import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/reaction/useMutates";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ReactionsModal from "@/components/reactions-modal";
import ReactionsButton from "@/components/reactions-button";
import Content from "./content";
import Actions from "./actions";

interface Props {
  className?: string;
  data: CommentReply & {
    user: User;
    file?: IFile | null;
    reactions: Reaction[];
    _count: { reactions: number };
  };
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
}

const CommentRepliesItem = ({
  data,
  dataComment,
  dataPost,
  className,
}: Props) => {
  const { userId } = useAuth();
  const { user, created_at, reactions, _count } = data;

  const { isPendingDeleteReaction, isPendingStoreReaction, onDelete, onStore } =
    useMutates();

  const [totalReactions, setTotalReactions] = useState(_count.reactions);
  const [modalReaction, toggleModalReaction] = useToggle(false);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(reactions?.[0]);

  useEffect(() => {
    setTotalReactions(_count.reactions);
    setCurrentUserReaction(reactions?.[0]);
  }, [data]);

  const handleClickEmotion = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type || !userId || !dataPost.id) return;
      await onStore(
        {
          type,
          user_id: userId,
          post_id: dataPost.id,
          comment_id: dataComment.id,
          reply_id: data.id,
        },
        (res) => {
          setCurrentUserReaction(res);
          setTotalReactions((prev) => prev + 1);
        }
      );
    },
    [data, dataPost, userId]
  );

  const handleClickReaction = useCallback(async () => {
    if (!userId || !dataPost.id) return;
    if (currentUserReaction)
      return onDelete(currentUserReaction.id, () => {
        setCurrentUserReaction(null);
        setTotalReactions((prev) => prev - 1);
      });
    await onStore(
      {
        type: emotions[0].type,
        user_id: userId,
        post_id: dataPost.id,
        comment_id: dataComment.id,
        reply_id: data.id,
      },
      (res) => {
        setCurrentUserReaction(res);
        setTotalReactions((prev) => prev + 1);
      }
    );
  }, [currentUserReaction, data, dataPost, userId, onDelete, onStore]);

  const button = useMemo(() => {
    const typeBtn = currentUserReaction?.type;
    const emo = emotions.find((item) => item.type === typeBtn) || emotions[0];
    const { color, label } = emo;
    return (
      <Button
        className="px-1 text-xs cursor-pointer select-none leading-normal hover:underline"
        variant="link"
        size="sm"
        disabled={isPendingStoreReaction || isPendingDeleteReaction}
        style={{ color: currentUserReaction ? color : "inherit" }}
        onClick={handleClickReaction}
      >
        {label}
      </Button>
    );
  }, [
    data,
    currentUserReaction,
    isPendingStoreReaction,
    isPendingDeleteReaction,
  ]);

  return (
    <div className={cn("w-full flex flex-col px-2 pt-1", className)}>
      <div className="w-full h-fit flex items-stretch group">
        <div className="flex-1 flex flex-col items-center mr-2">
          <AvatarImg src={user.avatar!} />
          <div className="flex-1 py-1">
            <div className="w-1 h-full bg-primary-foreground/40"></div>
          </div>
        </div>

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
            <TooltipButton className="rounded-full" button={button}>
              <div className="flex items-center justify-center gap-1">
                {emotions.map(({ label, type, icon: Icon }) => (
                  <div
                    key={label}
                    data-type={type}
                    className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-solid cursor-pointer transition-all hover:scale-110"
                    onClick={handleClickEmotion}
                  >
                    <Icon />
                  </div>
                ))}
              </div>
            </TooltipButton>
            {totalReactions > 0 && (
              <ReactionsButton
                totalReactions={totalReactions}
                onClick={() => toggleModalReaction(true)}
              />
            )}
          </div>
        </div>
      </div>

      <ReactionsModal
        data={dataPost}
        replyId={data.id}
        commentId={dataComment.id}
        open={modalReaction}
        onOpenChange={toggleModalReaction}
      />
    </div>
  );
};

export default CommentRepliesItem;
