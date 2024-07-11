"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { Report } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { update } from "@/actions/report";
import { destroy as removePost } from "@/actions/post";
import { destroy as removeGroup } from "@/actions/group";
import { destroy as removeReply } from "@/actions/replies";
import { destroy as removeComment } from "@/actions/comments";
import { banUser, unBanUser } from "@/actions/admin";

export const useMutates = (data?: Report) => {
  const router = useRouter();

  const { mutate: mutateUpdateReport } = useMutation({
    mutationKey: ["report", "update", data?.id],
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
    if (data) mutateUpdateReport({ id: data.id, status: 1 });
  };

  // USER
  const { mutateAsync: mutateAsyncUnBanUser, isPending: isPendingUnBanUser } =
    useMutation({
      mutationKey: ["user", "un-ban"],
      mutationFn: unBanUser,
      onSuccess() {
        toast.success("Bỏ cấm người dùng thành công");
        onSuccess();
      },
      onError() {
        toast.error("Bỏ cấm người dùng thất bại. Vui lòng thử lại sau");
      },
    });

  const { mutateAsync: mutateAsyncBanUser, isPending: isPendingBanUser } =
    useMutation({
      mutationKey: ["user", "ban"],
      mutationFn: banUser,
      onSuccess() {
        toast.success("Cấm người dùng thành công");
        onSuccess();
      },
      onError() {
        toast.error("Cấm người dùng thất bại. Vui lòng thử lại sau");
      },
    });

  // REPLY
  const {
    mutateAsync: mutateAsyncRemoveReply,
    isPending: isPendingRemoveReply,
  } = useMutation({
    mutationKey: ["reply", "remove"],
    mutationFn: removeReply,
    onSuccess() {
      toast.success("Xóa phản hồi thành công");
      onSuccess();
    },
    onError() {
      toast.error("Xóa phản hồi thất bại. Vui lòng thử lại sau");
    },
  });

  // COMMENT
  const {
    mutateAsync: mutateAsyncRemoveComment,
    isPending: isPendingRemoveComment,
  } = useMutation({
    mutationKey: ["comment", "remove"],
    mutationFn: removeComment,
    onSuccess() {
      toast.success("Xóa bình luận thành công");
      onSuccess();
    },
    onError() {
      toast.error("Xóa bình luận thất bại. Vui lòng thử lại sau");
    },
  });

  // POST
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

  // GROUP
  const {
    mutateAsync: mutateAsyncRemoveGroup,
    isPending: isPendingRemoveGroup,
  } = useMutation({
    mutationKey: ["group", "remove"],
    mutationFn: removeGroup,
    onSuccess() {
      toast.success("Xóa nhóm thành công");
      onSuccess();
    },
    onError() {
      toast.error("Xóa nhóm thất bại. Vui lòng thử lại sau");
    },
  });

  // USER
  const onBanUser = useCallback(
    async (id: string, callback?: Function | null) => {
      await mutateAsyncBanUser(id).then((e) => callback?.());
    },
    []
  );
  const onUnBanUser = useCallback(
    async (id: string, callback?: Function | null) => {
      await mutateAsyncUnBanUser(id).then((e) => callback?.());
    },
    []
  );

  // REPLY
  const onRemoveReply = useCallback(
    async (id: number, callback?: Function | null) => {
      await mutateAsyncRemoveReply(id).then((e) => callback?.());
    },
    []
  );

  // COMMENT
  const onRemoveComment = useCallback(
    async (id: number, callback?: Function | null) => {
      await mutateAsyncRemoveComment(id).then((e) => callback?.());
    },
    []
  );

  // POST
  const onRemovePost = useCallback(
    async (id: number, callback?: Function | null) => {
      await mutateAsyncRemovePost(id).then((e) => callback?.());
    },
    []
  );

  // GROUP
  const onRemoveGroup = useCallback(
    async (id: number, callback?: Function | null) => {
      await mutateAsyncRemoveGroup(id).then((e) => callback?.());
    },
    []
  );

  return {
    isPendingBanUser,
    isPendingUnBanUser,
    isPendingRemovePost,
    isPendingRemoveGroup,
    isPendingRemoveReply,
    isPendingRemoveComment,
    onBanUser,
    onUnBanUser,
    onRemovePost,
    onRemoveGroup,
    onRemoveReply,
    onRemoveComment,
  } as const;
};
