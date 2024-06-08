"use client";

import {
  User,
  Post,
  Group,
  Comment,
  Reaction,
  File as IFile,
} from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { emotions } from "@/lib/const";
import { cn, formatAmounts, getRelativeTime } from "@/lib/utils";
import { useMutates } from "@/hooks/mutations/reaction/useMutates";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ReactionsModal from "@/components/reactions-modal";
import ReactionsButton from "@/components/reactions-button";
import Content from "./content";
import Actions from "./actions";
import { useToggle } from "@/hooks/useToggle";

interface Props {
  className?: string;
  data: Comment & {
    user: User;
    file?: IFile | null;
    reacts: Reaction[];
    _count: { reacts: number; commentReplies: number };
  };
  dataPost: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
  };
}

const CommentItem = ({ data, dataPost, className }: Props) => {
  const { userId } = useAuth();
  const { user, created_at, reacts, _count } = data;

  const { isPendingDeleteReaction, isPendingStoreReaction, onDelete, onStore } =
    useMutates();

  const [totalReactions, setTotalReactions] = useState(_count.reacts);
  const [modalReaction, toggleModalReaction] = useToggle(false);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(reacts?.[0]);

  useEffect(() => {
    setTotalReactions(_count.reacts);
    setCurrentUserReaction(reacts?.[0]);
  }, [data]);

  const handleClickEmotion = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type || !userId || !dataPost.id) return;
      await onStore(
        { type, user_id: userId, post_id: dataPost.id, comment_id: data.id },
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
        comment_id: data.id,
      },
      (res) => {
        setCurrentUserReaction(res);
        setTotalReactions((prev) => prev + 1);
      }
    );
  }, [data, dataPost, userId, onDelete, onStore]);

  const button = useMemo(() => {
    const typeBtn = currentUserReaction?.type;
    const emo = emotions.find((item) => item.type === typeBtn) || emotions[0];
    if (!emo) return;
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
  }, [currentUserReaction, data]);

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
            <Button
              className="px-1 text-xs text-inherit cursor-pointer select-none leading-normal hover:underline"
              variant="link"
              size="sm"
            >
              Phản hồi
            </Button>
            {totalReactions > 0 && (
              <ReactionsButton
                totalReactions={totalReactions}
                onClick={() => toggleModalReaction(true)}
              />
            )}
          </div>

          {!!_count.commentReplies && (
            <div className="cursor-pointer hover:underline px-1">
              {formatAmounts(_count.commentReplies)} phản hồi
            </div>
          )}
        </div>
      </div>

      <ReactionsModal
        data={dataPost}
        commentId={data.id}
        open={modalReaction}
        onOpenChange={toggleModalReaction}
      />
    </div>
  );
};

export default CommentItem;
