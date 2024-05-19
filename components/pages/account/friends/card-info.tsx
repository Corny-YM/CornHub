"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Follower, User } from "@prisma/client";
import { BellOff, BellRing, Ellipsis, UserX } from "lucide-react";

import NoAvatar from "@/public/no-avatar.jpg";
import { following, unfollow, unfriend } from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";

interface Props {
  data: User;
  accountId: string;
  queryKey: string[];
}

const CardInfo = ({ data, accountId, queryKey }: Props) => {
  const queryClient = useQueryClient();

  const { userId } = useAuth();
  const { isOwner, statusFollowers, refetchStatusFollowers } =
    useAccountContext();
  const { id, avatar, full_name } = data;

  const { mutate: mutateFollowing, isPending: isPendingFollowing } =
    useMutation({
      mutationKey: ["account", "following", userId, id],
      mutationFn: following,
      onSuccess() {
        refetchStatusFollowers();
        queryClient.invalidateQueries({ queryKey });
        toast.success(`Đã theo dõi "${full_name}"`);
      },
      onError() {
        toast.error("Theo dõi thất bại. Vui lòng thử lại sau");
      },
    });
  const { mutate: mutateUnFollow, isPending: isPendingUnFollow } = useMutation({
    mutationKey: ["account", "unfollow", userId, id],
    mutationFn: unfollow,
    onSuccess() {
      refetchStatusFollowers();
      queryClient.invalidateQueries({ queryKey });
      toast.success(`Đã hủy theo dõi "${full_name}"`);
    },
    onError() {
      toast.error("Hủy theo dõi thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutate: mutateUnfriend, isPending: isPendingUnfriend } = useMutation({
    mutationKey: ["account", "unfriend", userId, id],
    mutationFn: unfriend,
    onSuccess() {
      refetchStatusFollowers();
      queryClient.invalidateQueries({ queryKey });
      toast.success(`Đã hủy kết bạn "${full_name}"`);
    },
    onError() {
      toast.error("Hủy kết bạn thất bại. Vui lòng thử lại sau");
    },
  });

  const handleFollowing = useCallback(() => {
    if (!userId) return;
    mutateFollowing({ userId, followerId: id });
  }, [id, userId, mutateFollowing]);

  const handleUnfollow = useCallback(() => {
    if (!userId) return;
    mutateUnFollow({ userId, followerId: id });
  }, [id, userId, mutateUnFollow]);

  const handleUnfriend = useCallback(() => {
    if (!userId) return;
    mutateUnfriend({ userId, friendId: id });
  }, [id, userId, mutateUnfriend]);

  const followStatus = useMemo(() => {
    const status = statusFollowers.find(
      ({ follower_id, user_id }) => follower_id === accountId && user_id === id
    );
    return status;
  }, [id, accountId, statusFollowers]);

  const actions = useMemo(() => {
    if (!isOwner) return [];
    const arrActions: IDropdownAction[] = [
      !!followStatus?.status
        ? {
            label: "Bỏ theo dõi",
            icon: <BellOff className="mr-2" size={20} />,
            disabled: isPendingUnfriend,
            onClick: handleUnfollow,
          }
        : {
            label: "Theo dõi",
            icon: <BellRing className="mr-2" size={20} />,
            disabled: isPendingFollowing,
            onClick: handleFollowing,
          },
      {
        label: "Hủy bạn bè",
        icon: <UserX className="mr-2" size={20} />,
        disabled: isPendingUnFollow,
        destructive: true,
        onClick: handleUnfriend,
      },
    ];
    return arrActions;
  }, [
    data,
    followStatus,
    isOwner,
    isPendingFollowing,
    isPendingUnFollow,
    isPendingUnfriend,
    handleFollowing,
    handleUnfollow,
    handleUnfriend,
  ]);

  return (
    <div className="flex items-center justify-center p-4 shadow-lg rounded-lg border border-solid border-gray-400/10">
      {/* avatar */}
      <div className="relative w-20 h-20 flex justify-center items-center rounded-lg overflow-hidden mr-4">
        <Image
          className="absolute w-full h-full"
          src={avatar || NoAvatar}
          alt={full_name || `friend-avatar-${id}`}
          fill
        />
      </div>
      {/* info */}
      <div className="flex-1 flex flex-col justify-center pr-4">
        <Link
          className="w-fit font-semibold line-clamp-2"
          target="_blank"
          href={`/account/${id}`}
        >
          {full_name}
        </Link>
      </div>
      {/* actions */}
      {isOwner && (
        <div className="flex items-center justify-center">
          <DropdownActions
            className="hover:bg-primary/50"
            icon={<Ellipsis size={20} />}
            actions={actions}
          />
        </div>
      )}
    </div>
  );
};

export default CardInfo;
