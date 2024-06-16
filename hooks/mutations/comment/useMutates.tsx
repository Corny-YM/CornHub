import toast from "react-hot-toast";
import { useCallback } from "react";
import { Comment } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { ICommentData, update, destroy, store } from "@/actions/comments";
import { useAuth } from "@clerk/nextjs";

export const useMutates = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const {
    mutateAsync: mutateAsyncUpdateComment,
    isPending: isPendingUpdateComment,
  } = useMutation({
    mutationKey: ["post", "comment", "update", userId],
    mutationFn: update,
    onSuccess() {
      toast.success("Cập nhật bình luận thành công");
      router.refresh();
    },
    onError() {
      toast.error("Cập nhật bình luận thất bại. Vui lòng thử lại sau");
    },
  });
  const {
    mutateAsync: mutateAsyncStoreComment,
    isPending: isPendingStoreComment,
  } = useMutation({
    mutationKey: ["post", "comment", "store", userId],
    mutationFn: store,
    onSuccess() {
      router.refresh();
      toast.success("Bình luận bài viết thành công");
    },
    onError() {
      toast.error("Bình luận bài viết thất bại. Vui lòng thử lại sau");
    },
  });
  const {
    mutateAsync: mutateAsyncDeleteComment,
    isPending: isPendingDeleteComment,
  } = useMutation({
    mutationKey: ["post", "comment", "delete", userId],
    mutationFn: destroy,
    onSuccess() {
      router.refresh();
      toast.success("Xóa bình luận thành công");
    },
    onError() {
      toast.error("Xóa bình luận thất bại. Vui lòng thử lại sau");
    },
  });

  const onUpdate = useCallback(
    async (data: ICommentData, callback?: (val: Comment) => void | null) => {
      const { postId, commentId, content } = data;
      if (!postId || !commentId || !content) return;
      await mutateAsyncUpdateComment({
        commentId,
        data: data,
      }).then((res) => callback?.(res));
    },
    []
  );

  const onStore = useCallback(
    async (data: ICommentData, callback?: (val: Comment) => void | null) => {
      const { postId, content, file } = data;
      if (!postId || !content) return;
      await mutateAsyncStoreComment({
        postId,
        content,
        file,
      }).then((res) => callback?.(res));
    },
    []
  );

  const onDelete = useCallback(
    async (reactionId: number, callback?: Function | null) => {
      if (!reactionId) return;
      await mutateAsyncDeleteComment(reactionId).then((e) => callback?.());
    },
    []
  );

  return {
    isPendingStoreComment,
    isPendingUpdateComment,
    isPendingDeleteComment,
    onStore,
    onUpdate,
    onDelete,
  } as const;
};
