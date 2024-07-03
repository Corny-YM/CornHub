"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getFriends } from "@/actions/user";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";
import CardInfo from "@/components/pages/account/friends/card-info";

interface Props {
  params: { userId: string };
}

const UserFriendsPage = ({ params }: Props) => {
  const queryKey = ["account", "friends", params.userId];

  // useQuery
  const { data: dataFriends, isLoading: isLoadingFriends } = useQuery({
    enabled: !!params.userId,
    queryKey: queryKey,
    queryFn: () => getFriends(params.userId, { limit: 20 }),
  });

  const accountFriends = useMemo(() => {
    if (!dataFriends?.friends) return [];
    return dataFriends.friends.map((fr) => {
      if (fr.user_id === params.userId) return fr.friend;
      return fr.user;
    });
  }, [params.userId, dataFriends]);

  if (isLoadingFriends)
    return (
      <div className="w-full flex justify-center items-center py-4">
        <Loading />
      </div>
    );

  if (!accountFriends.length) return <EmptyData className="mt-4" />;

  return (
    <div className="w-full grid grid-cols-2 gap-2 mt-4">
      {accountFriends.map((item) => (
        <CardInfo
          key={item.id}
          data={item}
          queryKey={queryKey}
          accountId={params.userId}
        />
      ))}
    </div>
  );
};

export default UserFriendsPage;
