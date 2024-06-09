"use client";

import Image from "next/image";
import { useMemo } from "react";
import { User } from "@prisma/client";
import { Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getFriends } from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";
import AvatarImg from "@/components/avatar-img";
import InfoActions from "./info-actions";
import Link from "next/link";

const Info = () => {
  const { accountData, isOwner } = useAccountContext();

  // useQuery
  const { data: dataFriends, isLoading: isLoadingFriends } = useQuery({
    enabled: !!accountData.id,
    queryKey: ["account", "friends", accountData.id],
    queryFn: () => getFriends(accountData.id, { limit: 5 }),
  });

  const accountFriends = useMemo(() => {
    if (!dataFriends || !dataFriends.friends) return [];
    const arrFriends: User[] = [];
    dataFriends.friends.forEach((item) => {
      if (item.friend_id !== accountData.id) arrFriends.push(item.friend);
      else arrFriends.push(item.user);
    });
    return arrFriends;
  }, [dataFriends, accountData]);

  const accountFriendsContent = useMemo(() => {
    if (isLoadingFriends) return null;
    if (!dataFriends || !dataFriends.friends || !dataFriends.friends?.length)
      return <div className="h-8" />;
    return accountFriends.map(({ id, full_name, avatar }, index) => (
      <Link
        key={id}
        className="friends-icon"
        target="_blank"
        href={`/account/${id}`}
        style={{ zIndex: length - index }}
      >
        <AvatarImg src={avatar} alt={full_name} />
      </Link>
    ));
  }, [dataFriends, isLoadingFriends, accountFriends]);

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
            sizes="w-40"
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
        {!!dataFriends?.totalFriends && (
          <div>
            <Link
              className="hover:underline w-fit"
              href={`/account/${accountData.id}/friends`}
            >
              {dataFriends?.totalFriends} bạn bè
            </Link>
          </div>
        )}
        <div className="w-full flex items-center">{accountFriendsContent}</div>
      </div>

      {/* Actions */}
      <InfoActions />
    </div>
  );
};

export default Info;
