import toast from "react-hot-toast";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { IRequestData, destroy, store } from "@/actions/reactions";

export const useMutates = () => {
  const router = useRouter();

  const {
    mutateAsync: mutateAsyncStoreReaction,
    isPending: isPendingStoreReaction,
  } = useMutation({
    mutationKey: ["post", "react", "store"],
    mutationFn: store,
    onSuccess() {
      router.refresh();
    },
    onError() {
      toast.error(
        "Thả tương tác bài viết không thành công. Vui lòng thử lại sau"
      );
    },
  });
  const {
    mutateAsync: mutateAsyncDeleteReaction,
    isPending: isPendingDeleteReaction,
  } = useMutation({
    mutationKey: ["post", "react", "delete"],
    mutationFn: destroy,
    onSuccess() {
      router.refresh();
    },
    onError() {
      toast.error("Thao tác không thất bại. Vui lòng thử lại sau");
    },
  });

  const onStore = useCallback(
    async (data: IRequestData, callback?: Function | null) => {
      const { post_id, type, user_id, comment_id, reply_id } = data;
      if (!post_id || !user_id || !type) return;
      await mutateAsyncStoreReaction({
        type,
        post_id,
        user_id,
        comment_id,
        reply_id,
      }).then((e) => callback?.());
    },
    []
  );

  const onDelete = useCallback(
    async (reactionId: number, callback?: Function | null) => {
      if (!reactionId) return;
      await mutateAsyncDeleteReaction(reactionId).then((e) => callback?.());
    },
    []
  );

  return {
    isPendingStoreReaction,
    isPendingDeleteReaction,
    onStore,
    onDelete,
  } as const;
};
