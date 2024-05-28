import toast from "react-hot-toast";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  userJoinGroup,
  userLeaveGroup,
  userUnfollowGroup,
  userFollowingGroup,
  userDeniedGroupRequest,
} from "@/actions/group";

interface Props {
  userId?: string | null;
  groupId: number;
}

export const useMutates = ({ groupId, userId }: Props) => {
  const router = useRouter();

  const { mutateAsync: mutateAsyncJoinGroup, isPending: isPendingJoin } =
    useMutation({
      mutationKey: ["group", "join", groupId, userId],
      mutationFn: userJoinGroup,
      onSuccess() {
        toast.success("Tham gia nhóm thành công");
        router.refresh();
      },
      onError() {
        toast.error("Tham gia nhóm thất bại. Vui lòng thử lại sau");
      },
    });

  const {
    mutateAsync: mutateAsyncDeniedGroupRequest,
    isPending: isPendingDeniedRequest,
  } = useMutation({
    mutationKey: ["group", "denied-group-request", groupId, userId],
    mutationFn: userDeniedGroupRequest,
    onSuccess() {
      toast.success("Từ chối lời mời thành công");
      router.refresh();
    },
    onError() {
      toast.error("Từ chối lời mời thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncFollowingGroup,
    isPending: isPendingFollowing,
  } = useMutation({
    mutationKey: ["group", "following", groupId, userId],
    mutationFn: userFollowingGroup,
    onSuccess() {
      toast.success("Theo dõi nhóm thành công");
      router.refresh();
    },
    onError() {
      toast.error("Theo dõi nhóm thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncUnfollowGroup,
    isPending: isPendingUnfollow,
  } = useMutation({
    mutationKey: ["group", "unfollow", groupId, userId],
    mutationFn: userUnfollowGroup,
    onSuccess() {
      toast.success("Bỏ theo dõi nhóm thành công");
      router.refresh();
    },
    onError() {
      toast.error("Bỏ theo dõi nhóm thất bại. Vui lòng thử lại sau");
    },
  });

  const { mutateAsync: mutateAsyncLeaveGroup, isPending: isPendingLeave } =
    useMutation({
      mutationKey: ["group", "leave", groupId, userId],
      mutationFn: userLeaveGroup,
      onSuccess() {
        toast.success("Rời nhóm thành công");
        router.refresh();
      },
      onError() {
        toast.error("Rời nhóm thất bại. Vui lòng thử lại sau");
      },
    });

  const onJoin = useCallback(
    async (callback?: Function | null) => {
      if (!userId || !groupId) return;
      await mutateAsyncJoinGroup({ userId, groupId: groupId }).then((e) =>
        callback?.()
      );
    },
    [userId, groupId]
  );

  const onFollowing = useCallback(
    async (callback?: Function | null) => {
      if (!userId || !groupId) return;
      await mutateAsyncFollowingGroup({ userId, groupId: groupId }).then((e) =>
        callback?.()
      );
    },
    [userId, groupId]
  );

  const onUnfollow = useCallback(
    async (callback?: Function | null) => {
      if (!userId || !groupId) return;
      await mutateAsyncUnfollowGroup({ userId, groupId: groupId }).then((e) =>
        callback?.()
      );
    },
    [userId, groupId]
  );

  const onLeave = useCallback(
    async (callback?: Function | null) => {
      if (!userId || !groupId) return;
      await mutateAsyncLeaveGroup({ userId, groupId: groupId }).then((e) =>
        callback?.()
      );
    },
    [userId, groupId]
  );

  const onDeniedRequest = useCallback(
    async (callback?: Function | null) => {
      if (!userId || !groupId) return;
      await mutateAsyncDeniedGroupRequest(groupId).then((e) => callback?.());
    },
    [userId, groupId]
  );

  return {
    isPendingJoin,
    isPendingLeave,
    isPendingUnfollow,
    isPendingFollowing,
    isPendingDeniedRequest,
    onJoin,
    onLeave,
    onUnfollow,
    onFollowing,
    onDeniedRequest,
  } as const;
};
