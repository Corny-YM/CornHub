"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { Follower, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { following, unfollow, unfriend } from "@/actions/user";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alert-modal";
import NoAvatar from "@/public/no-avatar.jpg";

type IUserWithFollowers = User & { followerUserInfo: Follower[] };

interface Props {
  data: IUserWithFollowers;
}

const FriendCard = ({ data }: Props) => {
  const { userId } = useAuth();
  const [friendData, setFriendData] = useState<IUserWithFollowers>(data);
  const [isUnfriend, setIsUnfriend] = useState(false);

  const { mutate: mutateUnFollow, isPending: isPendingUnFollow } = useMutation({
    mutationKey: ["account", "unfollow", userId, friendData.id],
    mutationFn: unfollow,
    onSuccess(res) {
      setFriendData((prev) => ({ ...prev, followerUserInfo: [res] }));
      toast.success(`Đã hủy theo dõi "${friendData.full_name}"`);
    },
    onError() {
      toast.error("Hủy theo dõi thất bại. Vui lòng thử lại sau");
    },
  });

  const { mutate: mutateFollowing, isPending: isPendingFollowing } =
    useMutation({
      mutationKey: ["account", "following", userId, friendData.id],
      mutationFn: following,
      onSuccess(res) {
        setFriendData((prev) => ({ ...prev, followerUserInfo: [res] }));
        toast.success(`Đã theo dõi "${friendData.full_name}"`);
      },
      onError() {
        toast.error("Theo dõi thất bại. Vui lòng thử lại sau");
      },
    });

  const { mutate: mutateUnfriend, isPending: isPendingUnfriend } = useMutation({
    mutationKey: ["account", "unfriend", userId, friendData.id],
    mutationFn: unfriend,
    onSuccess() {
      setIsUnfriend(true);
      toast.success(`Đã hủy kết bạn "${friendData.full_name}"`);
    },
    onError() {
      toast.error("Hủy kết bạn thất bại. Vui lòng thử lại sau");
    },
  });

  const isFollowing = useMemo(() => {
    const followings = friendData.followerUserInfo.filter(
      (item) => !!item.status
    );
    return !!followings.length;
  }, [friendData]);

  const handleUnfollow = useCallback(() => {
    if (!userId) return;
    mutateUnFollow({ userId, followerId: friendData.id });
  }, [userId, friendData]);

  const handleFollowing = useCallback(() => {
    if (!userId) return;
    mutateFollowing({ userId, followerId: friendData.id });
  }, [userId, friendData]);

  const handleUnfriend = useCallback(() => {
    if (!userId) return;
    mutateUnfriend({ userId, friendId: friendData.id });
  }, [userId, friendData]);

  const contentActions = useMemo(
    () => (
      <>
        {isFollowing ? (
          <Button
            className="w-full hover:bg-primary/50"
            variant="outline"
            size="sm"
            disabled={isPendingUnFollow}
            onClick={handleUnfollow}
          >
            Bỏ theo dõi
          </Button>
        ) : (
          <Button
            className="w-full hover:bg-primary/50"
            variant="outline"
            size="sm"
            disabled={isPendingFollowing}
            onClick={handleFollowing}
          >
            Theo dõi
          </Button>
        )}
        {!isUnfriend && (
          <AlertModal
            destructive
            disabled={isPendingUnfriend}
            onClick={handleUnfriend}
          >
            <Button className="w-full" variant="destructive" size="sm">
              Hủy kết bạn
            </Button>
          </AlertModal>
        )}
      </>
    ),
    [
      isUnfriend,
      isFollowing,
      isPendingUnFollow,
      isPendingFollowing,
      isPendingUnfriend,
      handleUnfollow,
      handleFollowing,
      handleUnfriend,
    ]
  );

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="flex justify-center items-center relative w-full h-auto aspect-square">
        <Image
          className="absolute w-full h-full"
          src={friendData.avatar || NoAvatar}
          alt={friendData.full_name || "avatar-friends"}
          fill
        />
      </div>
      <div className="w-full flex flex-col p-3 gap-y-1">
        <div className="font-medium">{friendData.full_name}</div>
        {contentActions}
      </div>
    </div>
  );
};

export default FriendCard;
