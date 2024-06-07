import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Group, Post, User } from "@prisma/client";
import { Forward, Info, MessageCircle, ThumbsUp } from "lucide-react";

import {
  countComments,
  countReactions,
  getCurrentUserReaction,
} from "@/actions/post";
import { destroy, store } from "@/actions/reactions";
import { emotions } from "@/lib/const";
import { cn, formatAmounts, getRandomItems } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TooltipButton from "@/components/tooltip-button";

interface Props {
  isModal?: boolean;
  data: Post & { user: User; group: Group | null };
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
  const { id } = data;

  // useQuery
  const { data: dataCountReactions, refetch: refetchCountReactions } = useQuery(
    {
      enabled: !!id,
      queryKey: ["post", "reactions", "count", id],
      queryFn: () => countReactions(id),
    }
  );
  const { data: dataCountComments } = useQuery({
    enabled: !!id,
    queryKey: ["post", "comments", "count", id],
    queryFn: () => countComments(id),
  });
  const { data: dataCurrentUserReaction, refetch: refetchUserReaction } =
    useQuery({
      enabled: !!id && !!userId,
      queryKey: ["post", "user", "reaction", id, userId],
      queryFn: () => getCurrentUserReaction({ postId: id, userId: userId! }),
    });

  // useMutation
  const { mutate: mutateStoreReaction, isPending: isPendingStoreReaction } =
    useMutation({
      mutationKey: ["post", "react", "store", userId, id],
      mutationFn: store,
      onSuccess() {
        refetchUserReaction();
        refetchCountReactions();
      },
      onError() {
        toast.error(
          "Thả tương tác bài viết không thành công. Vui lòng thử lại sau"
        );
      },
    });
  const { mutate: mutateDeleteReaction, isPending: isPendingDeleteReaction } =
    useMutation({
      mutationKey: ["post", "react", "delete", userId, id],
      mutationFn: destroy,
      onSuccess() {
        refetchUserReaction();
        refetchCountReactions();
      },
      onError() {
        toast.error("Thao tác không thất bại. Vui lòng thử lại sau");
      },
    });

  const handleClickEmotion = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type) return;
      mutateStoreReaction({
        type,
        post_id: id,
        user_id: userId,
      });
    },
    [id, userId, mutateStoreReaction]
  );

  const handleClickReaction = useCallback(() => {
    if (dataCurrentUserReaction)
      return mutateDeleteReaction(dataCurrentUserReaction.id);
    mutateStoreReaction({
      type: emotions[0].type,
      post_id: id,
      user_id: userId,
    });
  }, [id, userId, dataCurrentUserReaction, mutateStoreReaction]);

  const button = useMemo(() => {
    const typeBtn = dataCurrentUserReaction?.type;
    const emo = emotions.find((item) => item.type === typeBtn) || emotions[0];
    const { color, label, icon: Icon } = emo;
    return (
      <Button
        className="hover:bg-primary/50 transition flex-1"
        variant="outline"
        disabled={isPendingStoreReaction || isPendingDeleteReaction}
        style={{ color: dataCurrentUserReaction ? color : "inherit" }}
        onClick={handleClickReaction}
      >
        <div className="w-5 h-5 flex justify-center items-center mr-1">
          {dataCurrentUserReaction ? <Icon /> : <ThumbsUp size={20} />}
        </div>
        <div className="font-medium">{label}</div>
      </Button>
    );
  }, [
    isPendingStoreReaction,
    isPendingDeleteReaction,
    dataCurrentUserReaction,
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
          (!!dataCountReactions || !!dataCountReactions) && "py-3"
        )}
      >
        {/* Emotions */}
        {!!dataCountReactions && (
          <div className="flex-1 flex items-center">
            <div className="flex items-center">
              {getRandomItems(emotions).map(({ type, icon: Icon }, index) => (
                <div
                  key={type}
                  className="emotions"
                  style={{ zIndex: emotions.length - index }}
                >
                  <Icon />
                </div>
              ))}
            </div>
            <div
              className="pl-1 cursor-pointer hover:underline"
              onClick={onClickReaction}
            >
              {dataCountReactions}
            </div>
          </div>
        )}

        {/* Comments */}
        {!!dataCountComments && (
          <div className="flex ml-3 items-center" onClick={onClickComment}>
            <span className="cursor-pointer hover:underline">
              {formatAmounts(dataCountComments)} bình luận
            </span>
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
