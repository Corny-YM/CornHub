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
import { useMutates as useMutatesReaction } from "@/hooks/mutations/reaction/useMutates";
import { useMutates as useMutatesReply } from "@/hooks/mutations/commentReply/useMutates";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ReactionsModal from "@/components/reactions-modal";
import ReactionsButton from "@/components/reactions-button";
import UserInputSending from "@/components/user-input-sending";
import Content from "./content";
import Actions from "./actions";

type CommentReplyWithInfoDetails = CommentReply & {
  user: User;
  file?: IFile | null;
  reactions: Reaction[];
  _count: { reactions: number };
};

interface Props {
  className?: string;
  data: CommentReplyWithInfoDetails;
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

  const {
    isPendingDeleteReaction,
    isPendingStoreReaction,
    onStore: onStoreReaction,
    onDelete: onDeleteReaction,
  } = useMutatesReaction();

  const {
    isPendingUpdateReply,
    onUpdate: onUpdateReply,
    onDelete: onDeleteReply,
  } = useMutatesReply();

  const [dataReply, setDataReply] = useState<CommentReplyWithInfoDetails>(data);

  const { _count, reactions, user, created_at } = dataReply;

  const [isDeleted, setIsDeleted] = useState(false);
  const [isEdit, toggleIsEdit] = useToggle(false);
  const [totalReactions, setTotalReactions] = useState(_count.reactions);
  const [modalReaction, toggleModalReaction] = useToggle(false);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(reactions?.[0]);

  useEffect(() => setDataReply(data), [data]);
  useEffect(() => setTotalReactions(_count.reactions), [_count.reactions]);
  useEffect(() => setCurrentUserReaction(reactions?.[0]), [reactions]);

  const handleClickEmotion = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type || !userId || !dataReply) return;
      await onStoreReaction(
        {
          type,
          user_id: userId,
          post_id: dataReply.post_id,
          comment_id: dataReply.comment_id,
          reply_id: dataReply.id,
        },
        (res) => {
          setCurrentUserReaction(res);
          setTotalReactions((prev) => prev + 1);
        }
      );
    },
    [dataReply, userId]
  );

  const handleClickReaction = useCallback(async () => {
    if (!userId || !dataReply.post_id) return;
    if (currentUserReaction)
      return onDeleteReaction(currentUserReaction.id, () => {
        setCurrentUserReaction(null);
        setTotalReactions((prev) => prev - 1);
      });
    await onStoreReaction(
      {
        type: emotions[0].type,
        user_id: userId,
        post_id: dataReply.post_id,
        comment_id: dataReply.comment_id,
        reply_id: dataReply.id,
      },
      (res) => {
        setCurrentUserReaction(res);
        setTotalReactions((prev) => prev + 1);
      }
    );
  }, [
    dataReply,
    userId,
    currentUserReaction,
    onStoreReaction,
    onDeleteReaction,
  ]);

  const handleUpdateComment = useCallback(
    async (inputData: { value: string }) => {
      if (!dataReply || !inputData.value.trim()) return;
      await onUpdateReply(
        dataReply.id,
        {
          commentId: dataReply.comment_id,
          postId: dataReply.post_id,
          content: inputData.value,
        },
        (res) => {
          toggleIsEdit(false);
          setDataReply((prev) => ({ ...prev, content: res.content }));
        }
      );
    },
    [dataReply]
  );

  const handleDeleteComment = useCallback(async () => {
    await onDeleteReply(dataReply.id, () => {
      setIsDeleted(true);
    });
  }, [dataReply]);

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
    dataReply,
    currentUserReaction,
    isPendingStoreReaction,
    isPendingDeleteReaction,
  ]);

  if (isDeleted) return null;
  return (
    <div className={cn("w-full flex flex-col px-2 pt-1", className)}>
      <div className="w-full h-fit flex items-stretch group">
        <div className="flex-1 flex flex-col items-center mr-2">
          <AvatarImg src={user.avatar!} />
          <div className="flex-1 py-1">
            <div className="w-1 h-full bg-primary-foreground/50"></div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          {isEdit && (
            <div className="px-2">
              <UserInputSending
                value={dataReply.content}
                showAvatar={false}
                disabled={isPendingUpdateReply}
                onSend={handleUpdateComment}
              />
              <div className="text-xs leading-normal">
                <Button
                  className="p-0 h-fit"
                  variant="link"
                  size="icon"
                  onClick={() => toggleIsEdit(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {!isEdit && (
            <>
              <div className="w-fit flex items-center gap-1">
                {/* Content */}
                <Content data={dataReply} />

                {/* Actions */}
                <div className="group-hover:opacity-100 opacity-0 h-full flex-grow flex-shrink flex justify-center items-center transition">
                  <Actions
                    data={dataReply}
                    dataPost={dataPost}
                    toggleIsEdit={toggleIsEdit}
                    onDelete={handleDeleteComment}
                  />
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
            </>
          )}
        </div>
      </div>

      <ReactionsModal
        data={dataPost}
        open={modalReaction}
        replyId={dataReply.id}
        commentId={dataReply.comment_id}
        onOpenChange={toggleModalReaction}
      />
    </div>
  );
};

export default CommentRepliesItem;
