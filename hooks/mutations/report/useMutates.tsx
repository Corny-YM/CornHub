"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { Report } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { update } from "@/actions/report";
import { destroy as removePost } from "@/actions/post";

export const useMutates = (data: Report) => {
  const router = useRouter();

  const { mutate: mutateUpdateReport } = useMutation({
    mutationKey: ["report", "update", data.id],
    mutationFn: update,
    onSuccess() {
      router.refresh();
    },
    onError() {
      toast.error("Cập nhật report thất bại. Vui lòng thử lại sau");
    },
  });

  const onSuccess = () => {
    router.refresh();
    mutateUpdateReport({ id: data.id, status: 1 });
  };

  const { mutateAsync: mutateAsyncRemovePost, isPending: isPendingRemovePost } =
    useMutation({
      mutationKey: ["post", "remove"],
      mutationFn: removePost,
      onSuccess() {
        toast.success("Xóa bài viết thành công");
        onSuccess();
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
