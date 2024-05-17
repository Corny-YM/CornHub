"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";
import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import {
  UserX,
  Pencil,
  Camera,
  BellOff,
  UserPlus,
  UserCheck,
  MessageCircle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ILucideIcon } from "@/types";
import { formatAmounts } from "@/lib/utils";
import { useAccountContext } from "@/providers/account-provider";
import {
  sendFriendRequest,
  getFriends,
  isAddedFriend,
  unFriend,
} from "@/actions/user";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";
import AvatarImg from "@/components/avatar-img";
import DropdownActions from "@/components/dropdown-actions";

interface IAction {
  id: string;
  label: string;
  primary: boolean;
  icon: ILucideIcon;
  onClick?: () => void;
}

const Info = () => {
  const { userId } = useAuth();
  const { accountData, isOwner } = useAccountContext();

  // useQuery
  const { data: dataFriends, isLoading: isLoadingFriends } = useQuery({
    enabled: !!accountData.id,
    queryKey: ["account", "friends", accountData.id],
    queryFn: () => getFriends(accountData.id),
  });
  const { data: dataFriendAdded } = useQuery({
    enabled: !!accountData.id && !!userId,
    queryKey: ["account", "friends", "added", userId, accountData.id],
    queryFn: () =>
      isAddedFriend({
        userId: userId!,
        friendId: accountData.id,
      }),
  });

  // useMutation
  const {
    mutate: mutateSendFriendRequest,
    isPending: isPendingSendFriendRequest,
  } = useMutation({
    mutationKey: ["account", "add-friend", userId, accountData.id],
    mutationFn: sendFriendRequest,
    onSuccess() {
      toast.success(`Đã gửi yêu cầu kết bạn tới "${accountData.full_name}"`);
    },
    onError() {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau");
    },
  });
  const { mutate: mutateUnfriend, isPending: isPendingUnFriend } = useMutation({
    mutationKey: ["account", "unfriend", userId, accountData.id],
    mutationFn: unFriend,
    onSuccess() {
      toast.success(`Đã hủy kết bạn tới "${accountData.full_name}"`);
    },
    onError() {
      toast.error("Hủy kết bạn thất bại. Vui lòng thử lại sau");
    },
  });

  const handleClickSendFriendRequest = useCallback(() => {
    console.log("add friend");
    console.log(userId, accountData);
    if (!userId || !accountData) return;
    mutateSendFriendRequest({ userId, friendId: accountData.id });
  }, [userId, accountData]);
  const handleClickUnfriend = useCallback(() => {
    if (!dataFriendAdded || !userId || !accountData) return;
    mutateUnfriend({ userId, friendId: accountData.id });
  }, [userId, accountData, dataFriendAdded]);
  const handleClickUnFollow = useCallback(() => {}, []);

  const totalFriends = useMemo(() => {
    if (!dataFriends) return 0;
    return formatAmounts(dataFriends.length);
  }, [dataFriends]);

  const accountFriends = useMemo(() => {
    if (!dataFriends) return [];
    const arrFriends: User[] = [];
    dataFriends.forEach((item) => {
      if (item.friend_id !== userId) arrFriends.push(item.friend);
      else arrFriends.push(item.user);
    });
    return arrFriends;
  }, [dataFriends, userId]);

  const accountFriendsContent = useMemo(() => {
    if (isLoadingFriends) return null;
    if (!dataFriends || !dataFriends.length) return <div className="h-8" />;
    return accountFriends.map(({ id, full_name, avatar }, index) => (
      <div key={id} className="friends-icon" style={{ zIndex: length - index }}>
        <AvatarImg src={avatar} alt={full_name} />
      </div>
    ));
  }, [dataFriends, isLoadingFriends, accountFriends]);

  const btnActions = useMemo(() => {
    const actions = isOwner
      ? [{ id: "edit", label: "Chỉnh sửa trang cá nhân", icon: Pencil }]
      : [
          {
            id: dataFriendAdded ? "friend" : "stranger",
            label: dataFriendAdded ? "Bạn bè" : "Thêm bạn bè",
            icon: dataFriendAdded ? UserCheck : UserPlus,
            disabled: dataFriendAdded ? false : isPendingSendFriendRequest,
            onClick: handleClickSendFriendRequest,
          },
          {
            id: "message",
            label: "Nhắn tin",
            icon: MessageCircle,
            primary: !!dataFriendAdded,
          },
        ];
    return actions as IAction[];
  }, [
    isOwner,
    dataFriendAdded,
    isPendingSendFriendRequest,
    handleClickSendFriendRequest,
  ]);

  return (
    <div className="w-full relative flex items-center px-4">
      {/* Avatar */}
      <div className="absolute left-4 bottom-2">
        <div className="relative w-40 h-40 flex justify-center items-center rounded-full overflow-hidden border border-solid border-neutral-900/50">
          <Image
            className="absolute w-full h-full"
            src={accountData.avatar || NoAvatar}
            alt={accountData.full_name || "account-avatar"}
            fill
          />
        </div>
        {isOwner && (
          <div className="absolute bottom-1 right-1">
            <Button className="rounded-full" variant="secondary" size="icon">
              <Camera size={20} />
            </Button>
          </div>
        )}
      </div>
      <div className="w-40 mr-4"></div>
      {/* Friends */}
      <div className="flex-1 h-full flex flex-col justify-center pt-6 pb-4">
        <div className="text-2xl font-semibold">{accountData.full_name}</div>
        {!!totalFriends && (
          <div>
            <a className="hover:underline w-fit" href="#">
              {totalFriends} bạn bè
            </a>
          </div>
        )}
        <div className="w-full flex items-center">{accountFriendsContent}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-x-1">
        {btnActions.map(({ id, label, primary, icon: Icon, onClick }) => {
          if (id !== "friend")
            return (
              <Button
                key={id}
                variant={primary ? "default" : "outline"}
                onClick={onClick}
              >
                <Icon className="mr-2" size={20} />
                {label}
              </Button>
            );
          return (
            <DropdownActions
              icon={
                <>
                  <Icon className="mr-2" size={20} />
                  {label}
                </>
              }
              actions={[
                {
                  label: "Bỏ theo dõi",
                  icon: <BellOff className="mr-2" size={20} />,
                  onClick: handleClickUnFollow,
                },
                {
                  label: "Hủy kết bạn",
                  destructive: true,
                  icon: <UserX className="mr-2" size={20} />,
                  onClick: handleClickUnfriend,
                },
              ]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Info;
