"use client";

import toast from "react-hot-toast";
import {
  User,
  Post,
  Group,
  Comment,
  Reaction,
  File as IFile,
} from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { store } from "@/actions/replies";
import { emotions } from "@/lib/const";
import { cn, formatAmounts, getRelativeTime } from "@/lib/utils";
import { useToggle } from "@/hooks/useToggle";
import { useMutates as useMutatesReaction } from "@/hooks/mutations/reaction/useMutates";
import { useMutates as useMutatesComment } from "@/hooks/mutations/comment/useMutates";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ReactionsModal from "@/components/reactions-modal";
import ReactionsButton from "@/components/reactions-button";
import UserInputSending from "@/components/user-input-sending";
import Content from "./content";
import Actions from "./actions";
import CommentRepliesList from "../comment-replies";

type CommentWithInfoDetails = Comment & {
  user: User;
  file?: IFile | null;
  reactions: Reaction[];
  _count: { reactions: number; commentReplies: number };
};

interface Props {
  className?: string;
  data: CommentWithInfoDetails;
  dataPost: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
  };
}

const CommentItem = ({ data, dataPost, className }: Props) => {
  const { userId } = useAuth();

  const { isPendingDeleteReaction, isPendingStoreReaction, onDelete, onStore } =
    useMutatesReaction();

  const { isPendingUpdateComment, onUpdate: onUpdateComment } =
    useMutatesComment();

  const [dataComment, setDataComment] = useState<CommentWithInfoDetails>(data);

  const { _count, reactions, user, created_at } = dataComment;

  const [isEdit, toggleIsEdit] = useToggle(false);
  const [isReply, toggleIsReply] = useToggle(false);
  const [showReplies, toggleShowReplies] = useToggle(false);
  const [totalReactions, setTotalReactions] = useState(_count.reactions);
  const [totalCommentReplies, setTotalCommentReplies] = useState(
    _count.commentReplies
  );
  const [modalReaction, toggleModalReaction] = useToggle(false);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(reactions?.[0]);

  useEffect(() => setDataComment(data), [data]);
  useEffect(
    () => setTotalCommentReplies(_count.commentReplies),
    [_count.commentReplies]
  );
  useEffect(() => setTotalReactions(_count.reactions), [_count.reactions]);
  useEffect(() => setCurrentUserReaction(reactions?.[0]), [reactions]);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["comments", "replying", dataComment.id],
    mutationFn: store,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["comment", "replies", dataPost.id, dataComment.id, userId],
      });
      toast.success("Tạo phản hồi thành công");
      setTotalCommentReplies((prev) => prev + 1);
    },
    onError() {
      toast.error("Tạo phản hồi thất bại. Vui lòng thử lại sau");
    },
  });

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
        },
        (res) => {
          setCurrentUserReaction(res);
          setTotalReactions((prev) => prev + 1);
        }
      );
    },
    [dataComment, dataPost, userId]
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
      },
      (res) => {
        setCurrentUserReaction(res);
        setTotalReactions((prev) => prev + 1);
      }
    );
  }, [currentUserReaction, dataComment, dataPost, userId, onDelete, onStore]);

  const handleClickReply = useCallback((e: React.MouseEvent) => {
    toggleIsReply();
  }, []);

  const handleSend = useCallback(
    (inputData: { value: string }) => {
      if (!dataComment || !dataPost || isPending) return;
      return mutateAsync({
        postId: dataPost.id,
        commentId: dataComment.id,
        content: inputData.value,
      });
    },
    [dataComment, dataPost, isPending]
  );

  const handleUpdateComment = useCallback(
    async (inputData: { value: string }) => {
      if (!dataComment || !inputData.value.trim()) return;
      await onUpdateComment(
        {
          commentId: dataComment.id,
          postId: dataComment.post_id,
          content: inputData.value,
        },
        (res) => {
          toggleIsEdit(false);
          setDataComment((prev) => ({ ...prev, content: res.content }));
        }
      );
    },
    [dataComment]
  );

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
    dataComment,
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
            <div className="w-1 h-full bg-primary-foreground/50"></div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          {isEdit && (
            <div className="px-2">
              <UserInputSending
                value={dataComment.content}
                showAvatar={false}
                disabled={isPendingUpdateComment}
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
                <Content data={dataComment} />

                {/* Actions */}
                <div className="group-hover:opacity-100 opacity-0 h-full flex-grow flex-shrink flex justify-center items-center transition">
                  <Actions
                    data={dataComment}
                    dataPost={dataPost}
                    toggleIsEdit={toggleIsEdit}
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
                <Button
                  className="px-1 text-xs text-inherit cursor-pointer select-none leading-normal hover:underline"
                  variant="link"
                  size="sm"
                  onClick={handleClickReply}
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
            </>
          )}

          {/* Content Replies */}
          {!!totalCommentReplies && (
            <CommentRepliesList
              open={showReplies}
              dataComment={dataComment}
              dataPost={dataPost}
              onOpenChange={toggleShowReplies}
            >
              <Button
                className="w-fit text-inherit cursor-pointer select-none leading-normal hover:underline"
                variant="ghost"
                size="sm"
                onClick={() => toggleShowReplies()}
              >
                {formatAmounts(totalCommentReplies)} phản hồi
              </Button>
            </CommentRepliesList>
          )}

          {/* Reply input */}
          {isReply && (
            <UserInputSending
              className="mt-1"
              disabled={isPending}
              onSend={handleSend}
            />
          )}
        </div>
      </div>

      <ReactionsModal
        data={dataPost}
        commentId={dataComment.id}
        open={modalReaction}
        onOpenChange={toggleModalReaction}
      />
    </div>
  );
};

export default CommentItem;
