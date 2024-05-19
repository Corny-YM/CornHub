"use client";

import toast from "react-hot-toast";
import {
  Send,
  UserX,
  Pencil,
  SquareX,
  BellOff,
  UserPlus,
  UserCheck,
  SquareCheck,
  MessageCircle,
  BellRing,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ILucideIcon } from "@/types";
import { getFriendStatus } from "@/actions/friend";
import {
  unfollow,
  unfriend,
  following,
  sendFriendRequest,
  deniedFriendRequest,
  acceptFriendRequest,
} from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import { Button } from "@/components/ui/button";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";

interface IAction {
  id: string;
  label: string;
  icon: ILucideIcon;
  primary?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  actions?: IDropdownAction[];
  onClick?: () => void;
}

const InfoActions = () => {
  const { userId } = useAuth();
  const { accountData, isOwner } = useAccountContext();

  const {
    data: dataFriendStatus,
    isLoading: isLoadingFriendStatus,
    refetch: refetchFriendStatus,
  } = useQuery({
    enabled: !!accountData.id && !!userId,
    queryKey: ["account", "friends", "status", userId, accountData.id],
    queryFn: () =>
      getFriendStatus({ userId: userId!, friendId: accountData.id }),
  });

  // useMutation
  const {
    mutate: mutateSendFriendRequest,
    isPending: isPendingSendFriendRequest,
  } = useMutation({
    mutationKey: ["account", "send-request", userId, accountData.id],
    mutationFn: sendFriendRequest,
    onSuccess() {
      refetchFriendStatus();
      toast.success(`Đã gửi yêu cầu kết bạn tới "${accountData.full_name}"`);
    },
    onError() {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau");
    },
  });
  const {
    mutate: mutateAcceptFriendRequest,
    isPending: isPendingAcceptFriendRequest,
  } = useMutation({
    mutationKey: ["account", "unfriend", userId, accountData.id],
    mutationFn: acceptFriendRequest,
    onSuccess() {
      refetchFriendStatus();
      toast.success(
        `Đã chấp nhận lời mời kết bạn của "${accountData.full_name}"`
      );
    },
    onError() {
      toast.error("Chấp nhận lời mời thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutate: mutateFollowing, isPending: isPendingFollowing } =
    useMutation({
      mutationKey: ["account", "following", userId, accountData.id],
      mutationFn: following,
      onSuccess() {
        refetchFriendStatus();
        toast.success(`Đã theo dõi "${accountData.full_name}"`);
      },
      onError() {
        toast.error("Theo dõi thất bại. Vui lòng thử lại sau");
      },
    });
  const {
    mutate: mutateDeniedFriendRequest,
    isPending: isPendingDeniedFriendRequest,
  } = useMutation({
    mutationKey: ["account", "denied-request", userId, accountData.id],
    mutationFn: deniedFriendRequest,
    onSuccess() {
      refetchFriendStatus();
      toast.success(
        `Đã từ chối lời mời kết bạn của "${accountData.full_name}"`
      );
    },
    onError() {
      toast.error("Từ chối lời mời thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutate: mutateUnfriend, isPending: isPendingUnfriend } = useMutation({
    mutationKey: ["account", "unfriend", userId, accountData.id],
    mutationFn: unfriend,
    onSuccess() {
      refetchFriendStatus();
      toast.success(`Đã hủy kết bạn "${accountData.full_name}"`);
    },
    onError() {
      toast.error("Hủy kết bạn thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutate: mutateUnFollow, isPending: isPendingUnFollow } = useMutation({
    mutationKey: ["account", "unfollow", userId, accountData.id],
    mutationFn: unfollow,
    onSuccess() {
      refetchFriendStatus();
      toast.success(`Đã hủy theo dõi "${accountData.full_name}"`);
    },
    onError() {
      toast.error("Hủy theo dõi thất bại. Vui lòng thử lại sau");
    },
  });

  // useCallback
  const handleSendFriendRequest = useCallback(() => {
    if (!userId || !accountData) return;
    mutateSendFriendRequest({ userId, friendId: accountData.id });
  }, [userId, accountData, mutateSendFriendRequest]);

  const handleAcceptFriendRequest = useCallback(() => {
    if (!userId || !accountData) return;
    mutateAcceptFriendRequest({ userId, friendId: accountData.id });
  }, [userId, accountData, mutateAcceptFriendRequest]);

  const handleDeniedFriendRequest = useCallback(() => {
    if (!userId || !accountData) return;
    mutateDeniedFriendRequest({ userId, friendId: accountData.id });
  }, [userId, accountData, mutateDeniedFriendRequest]);

  const handleRemoveFriendRequest = useCallback(() => {}, []);

  const handleUnfriend = useCallback(() => {
    if (!dataFriendStatus?.friend || !userId || !accountData) return;
    mutateUnfriend({ userId, friendId: accountData.id });
  }, [userId, accountData, dataFriendStatus, mutateUnfriend]);

  const handleFollowing = useCallback(() => {
    if (!userId || !accountData) return;
    mutateFollowing({ userId, followerId: accountData.id });
  }, [userId, accountData, mutateFollowing]);

  const handleUnfollow = useCallback(() => {
    if (!userId || !accountData) return;
    mutateUnFollow({ userId, followerId: accountData.id });
  }, [userId, accountData, mutateUnFollow]);

  // useMemo
  const btnActions = useMemo(() => {
    const actions: IAction[] = [];
    if (isLoadingFriendStatus) return actions;
    if (isOwner) {
      actions.push({
        id: "edit",
        label: "Chỉnh sửa trang cá nhân",
        icon: Pencil,
      });
    } else if (dataFriendStatus?.friendRequest) {
      if (userId === dataFriendStatus.friendRequest.sender_id) {
        actions.push({
          id: "send-request",
          label: "Đã gửi lời mời kết bạn",
          icon: Send,
          actions: [
            {
              label: "Hủy bỏ lời mời kết bạn",
              destructive: true,
              icon: <SquareX className="mr-2" size={20} />,
              onClick: handleRemoveFriendRequest,
            },
          ],
        });
      } else {
        actions.push(
          {
            id: "receive-request-accept",
            label: "Chấp nhận",
            icon: SquareCheck,
            disabled: isPendingAcceptFriendRequest,
            onClick: handleAcceptFriendRequest,
          },
          {
            id: "receive-request-denied",
            label: "Hủy bỏ",
            icon: SquareX,
            destructive: true,
            disabled: isPendingDeniedFriendRequest,
            onClick: handleDeniedFriendRequest,
          }
        );
      }
    } else if (dataFriendStatus?.friend) {
      const followActions = dataFriendStatus.follower.status
        ? {
            label: "Bỏ theo dõi",
            icon: <BellOff className="mr-2" size={20} />,
            disabled: isPendingUnFollow,
            onClick: handleUnfollow,
          }
        : {
            label: "Theo dõi",
            icon: <BellRing className="mr-2" size={20} />,
            disabled: isPendingFollowing,
            onClick: handleFollowing,
          };
      actions.push(
        {
          id: "friend",
          label: "Bạn bè",
          icon: UserCheck,
          actions: [
            followActions,
            {
              label: "Hủy kết bạn",
              destructive: true,
              disabled: isPendingUnfriend,
              icon: <UserX className="mr-2" size={20} />,
              onClick: handleUnfriend,
            },
          ],
        },
        {
          id: "message",
          label: "Nhắn tin",
          icon: MessageCircle,
          primary: !!dataFriendStatus.friend,
        }
      );
    } else {
      actions.push({
        id: "stranger",
        label: "Thêm bạn bè",
        icon: UserPlus,
        disabled: isPendingSendFriendRequest,
        onClick: handleSendFriendRequest,
      });
    }
    return actions;
  }, [
    userId,
    isOwner,
    dataFriendStatus,
    isPendingUnfriend,
    isPendingFollowing,
    isLoadingFriendStatus,
    isPendingSendFriendRequest,
    isPendingAcceptFriendRequest,
    isPendingDeniedFriendRequest,
    handleUnfollow,
    handleUnfriend,
    handleFollowing,
    handleSendFriendRequest,
    handleRemoveFriendRequest,
    handleAcceptFriendRequest,
    handleDeniedFriendRequest,
  ]);

  return (
    <div className="flex items-center gap-x-2">
      {btnActions.map(({ icon: Icon, ...res }) => {
        if (res.id !== "friend" && res.id !== "send-request") {
          const variant = res.primary
            ? "default"
            : res.destructive
            ? "destructive"
            : "outline";
          return (
            <Button key={res.id} variant={variant} onClick={res.onClick}>
              <Icon className="mr-2" size={20} />
              {res.label}
            </Button>
          );
        }
        return (
          <DropdownActions
            key={res.id}
            icon={
              <>
                <Icon className="mr-2" size={20} />
                {res.label}
              </>
            }
            size="default"
            disabled={res.disabled}
            actions={res.actions || []}
          />
        );
      })}
    </div>
  );
};

export default InfoActions;
