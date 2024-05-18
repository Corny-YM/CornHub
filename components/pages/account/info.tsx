"use client";

import Image from "next/image";
import { useMemo } from "react";
import { User } from "@prisma/client";
import { Camera } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { formatAmounts } from "@/lib/utils";
import { getFriends } from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";
import AvatarImg from "@/components/avatar-img";
import InfoActions from "./info-actions";

const Info = () => {
  const { userId } = useAuth();
  const { accountData, isOwner } = useAccountContext();

  // useQuery
  const { data: dataFriends, isLoading: isLoadingFriends } = useQuery({
    enabled: !!accountData.id,
    queryKey: ["account", "friends", accountData.id],
    queryFn: () => getFriends(accountData.id),
  });

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
      <InfoActions />
    </div>
  );
};

export default Info;
