import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Forward, Info, MessageCircle, ThumbsUp } from "lucide-react";
import { Group, Post, Reaction, User, File as IFile } from "@prisma/client";

import { emotions } from "@/lib/const";
import { cn, formatAmounts, getRandomItems } from "@/lib/utils";
import { useMutates } from "@/hooks/mutations/reaction/useMutates";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TooltipButton from "@/components/tooltip-button";
import ReactionsButton from "@/components/reactions-button";

interface Props {
  isModal?: boolean;
  data: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
    reactions: Reaction[];
    _count: { comments: number; reactions: number };
  };
  onClickReaction: () => void;
  onClickComment: () => void;
}

const PostFooter = ({
  data,
  isModal,
  onClickReaction,
  onClickComment,
}: Props) => {
  const { userId } = useAuth();
  const { id, reactions, _count } = data;

  // useMutation
  const { isPendingDeleteReaction, isPendingStoreReaction, onDelete, onStore } =
    useMutates();

  const [totalReactions, setTotalReactions] = useState(_count.reactions);
  const [totalComments, setTotalComments] = useState(_count.comments);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(reactions?.[0]);

  useEffect(() => setTotalReactions(_count.reactions), [_count.reactions]);
  useEffect(() => setTotalComments(_count.comments), [_count.comments]);
  useEffect(() => setCurrentUserReaction(reactions?.[0]), [reactions]);

  const handleClickEmotion = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type || !userId) return;
      await onStore(
        {
          type,
          post_id: id,
          user_id: userId,
          reply_id: undefined,
          comment_id: undefined,
        },
        (res) => {
          setCurrentUserReaction(res);
          if (!currentUserReaction) setTotalReactions((prev) => prev + 1);
        }
      );
    },
    [id, userId, currentUserReaction, onStore]
  );

  const handleClickReaction = useCallback(async () => {
    if (!userId) return;
    if (currentUserReaction) {
      await onDelete(currentUserReaction.id, () => {
        setCurrentUserReaction(null);
        setTotalReactions((prev) => prev - 1);
      });
      return;
    }
    await onStore(
      { type: emotions[0].type, post_id: id, user_id: userId },
      (res) => {
        setCurrentUserReaction(res);
        setTotalReactions((prev) => prev + 1);
      }
    );
  }, [id, userId, currentUserReaction, onStore, onDelete]);

  const button = useMemo(() => {
    const typeBtn = currentUserReaction?.type;
    const emo = emotions.find((item) => item.type === typeBtn) || emotions[0];
    const { color, label, icon: Icon } = emo;
    return (
      <Button
        className="hover:bg-primary/50 transition flex-1"
        variant="outline"
        disabled={isPendingStoreReaction || isPendingDeleteReaction}
        style={{ color: currentUserReaction ? color : "inherit" }}
        onClick={handleClickReaction}
      >
        <div className="w-5 h-5 flex justify-center items-center mr-1">
          {currentUserReaction ? <Icon /> : <ThumbsUp size={20} />}
        </div>
        <div className="font-medium">{label}</div>
      </Button>
    );
  }, [
    isPendingStoreReaction,
    isPendingDeleteReaction,
    currentUserReaction,
    handleClickReaction,
  ]);

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-center text-sm px-4",
        isModal && "px-0"
      )}
    >
      <div
        className={cn(
          "w-full flex items-center",
          (!!totalReactions || !!totalComments) && "py-3"
        )}
      >
        {/* Emotions */}
        {!!totalReactions && (
          <div className="flex items-center mr-3">
            <ReactionsButton
              totalReactions={totalReactions}
              onClick={onClickReaction}
            />
          </div>
        )}

        {/* Comments */}
        {!!totalComments && (
          <div className="flex-1 flex justify-end items-center">
            <Button
              className="px-2 py-1 w-fit h-[30px] text-xs rounded-full leading-normal dark:hover:bg-primary-foreground hover:underline"
              variant="outline"
              size="sm"
              onClick={onClickComment}
            >
              {formatAmounts(totalComments)} bình luận
            </Button>
          </div>
        )}
      </div>

      <Separator className="dark:bg-neutral-200/50 bg-neutral-400" />

      <div className="w-full flex items-center pt-2 pb-3 gap-x-2">
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
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
          onClick={onClickComment}
        >
          <MessageCircle className="mr-1" size={20} />
          Bình luận
        </Button>
        <Button
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
          onClick={() =>
            toast(
              <div className="w-fit">Đang trong quá trình phát triển 💕</div>,
              { icon: <Info className="text-blue-400" /> }
            )
          }
        >
          <Forward className="mr-1" size={20} />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default PostFooter;
