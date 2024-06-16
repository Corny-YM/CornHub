import toast from "react-hot-toast";
import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CommentReply } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { IReplyData, update, destroy, store } from "@/actions/replies";

export const useMutates = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const {
    mutateAsync: mutateAsyncUpdateReply,
    isPending: isPendingUpdateReply,
  } = useMutation({
    mutationKey: ["post", "comment", "reply", "update", userId],
    mutationFn: update,
    onSuccess() {
      toast.success("Cập nhật phản hồi thành công");
      router.refresh();
    },
    onError() {
      toast.error("Cập nhật phản hồi thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutateAsync: mutateAsyncStoreReply, isPending: isPendingStoreReply } =
    useMutation({
      mutationKey: ["post", "comment", "reply", "store", userId],
      mutationFn: store,
      onSuccess() {
        router.refresh();
        toast.success("Phản hồi bình luận thành công");
      },
      onError() {
        toast.error("Phản hồi bình luận thất bại. Vui lòng thử lại sau");
      },
    });
  const {
    mutateAsync: mutateAsyncDeleteReply,
    isPending: isPendingDeleteReply,
  } = useMutation({
    mutationKey: ["post", "comment", "reply", "delete", userId],
    mutationFn: destroy,
    onSuccess() {
      router.refresh();
      toast.success("Xóa phản hồi thành công");
    },
    onError() {
      toast.error("Xóa phản hồi thất bại. Vui lòng thử lại sau");
    },
  });

  const onUpdate = useCallback(
    async (
      replyId: number,
      data: IReplyData,
      callback?: (val: CommentReply) => void | null
    ) => {
      const { postId, commentId, content } = data;
      if (!postId || !commentId || !content) return;
      await mutateAsyncUpdateReply({
        replyId,
        data: data,
      }).then((res) => callback?.(res));
    },
    []
  );

  const onStore = useCallback(
    async (data: IReplyData, callback?: (val: CommentReply) => void | null) => {
      const { postId, content, file, commentId } = data;
      if (!postId || !commentId || !content) return;
      await mutateAsyncStoreReply({ file, postId, content, commentId }).then(
        (res) => callback?.(res)
      );
    },
    []
  );

  const onDelete = useCallback(
    async (reactionId: number, callback?: Function | null) => {
      if (!reactionId) return;
      await mutateAsyncDeleteReply(reactionId).then((e) => callback?.());
    },
    []
  );

  return {
    isPendingStoreReply,
    isPendingUpdateReply,
    isPendingDeleteReply,
    onStore,
    onUpdate,
    onDelete,
  } as const;
};
