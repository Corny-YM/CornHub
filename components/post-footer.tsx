import { useCallback, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Group, Post, User } from "@prisma/client";
import { Forward, MessageCircle, ThumbsUp } from "lucide-react";

import {
  countComments,
  countReactions,
  getCurrentUserReaction,
} from "@/actions/post";
import { cn, formatAmounts, getRandomItems } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TooltipButton from "@/components/tooltip-button";
import Like from "@/components/icons/like";
import Heart from "@/components/icons/heart";
import Love from "@/components/icons/love";
import Smile from "@/components/icons/smile";
import Wow from "@/components/icons/wow";
import Sad from "@/components/icons/sad";
import Angry from "@/components/icons/angry";
import { destroy, store } from "@/actions/reactions";
import toast from "react-hot-toast";

interface Props {
  data: Post & { user: User; group: Group | null };
}

const emotions = [
  { label: "Thích", type: "like", color: "#0866ff", icon: Like },
  { label: "Yêu thích", type: "heart", color: "#f33e58", icon: Heart },
  { label: "Thương thương", type: "love", color: "#f7b125", icon: Love },
  { label: "Haha", type: "smile", color: "#f7b125", icon: Smile },
  { label: "Wow", type: "wow", color: "#f7b125", icon: Wow },
  { label: "Buồn", type: "sad", color: "#f7b125", icon: Sad },
  { label: "Phẫn nộ", type: "angry", color: "#e9710f", icon: Angry },
];

const PostFooter = ({ data }: Props) => {
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
    [id, userId]
  );

  const handleClickReaction = useCallback(() => {
    if (dataCurrentUserReaction)
      return mutateDeleteReaction(dataCurrentUserReaction.id);
    mutateStoreReaction({
      type: emotions[0].type,
      post_id: id,
      user_id: userId,
    });
  }, [id, dataCurrentUserReaction]);

  const button = useMemo(() => {
    const typeBtn = dataCurrentUserReaction?.type;
    const emo = emotions.find((item) => item.label === typeBtn) || emotions[0];
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
  ]);

  return (
    <div className="w-full flex flex-col justify-center text-sm px-4">
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
            <div className="pl-1 cursor-pointer hover:underline">
              {dataCountReactions}
            </div>
          </div>
        )}

        {/* Comments */}
        {!!dataCountComments && (
          <div className="flex ml-3 items-center">
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
            {emotions.map(({ label, icon: Icon }) => (
              <div
                key={label}
                data-type={label}
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
        >
          <MessageCircle className="mr-1" size={20} />
          Bình luận
        </Button>
        <Button
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
        >
          <Forward className="mr-1" size={20} />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default PostFooter;
