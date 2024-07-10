"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { destroy as removePost } from "@/actions/post";

export const useMutates = () => {
  const router = useRouter();

  const { mutateAsync: mutateAsyncRemovePost, isPending: isPendingRemovePost } =
    useMutation({
      mutationKey: ["post", "remove"],
      mutationFn: removePost,
      onSuccess() {
        toast.success("Xóa bài viết thành công");
        router.refresh();
      },
      onError() {
        toast.error("Xóa bài viết thất bại. Vui lòng thử lại sau");
      },
    });

  const onRemovePost = useCallback(
    async (postId: number, callback?: Function | null) => {
      await mutateAsyncRemovePost(postId).then((e) => callback?.());
    },
    []
  );

  return {
    isPendingRemovePost,
    onRemovePost,
  } as const;
};
