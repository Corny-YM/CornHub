"use client";

import Link from "next/link";
import { useMemo } from "react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getFriends } from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import AvatarImg from "@/components/avatar-img";
import InfoActions from "./info-actions";
import InfoAvatar from "./info-avatar";

const Info = () => {
  const { accountData } = useAccountContext();

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
        href={`/account/${id}`}
        style={{ zIndex: length - index + 5 }}
      >
        <AvatarImg className="w-full h-full" src={avatar} alt={full_name} />
      </Link>
    ));
  }, [dataFriends, isLoadingFriends, accountFriends]);

  return (
    <div className="w-full relative flex items-center px-4">
      {/* Avatar */}
      <InfoAvatar />

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
