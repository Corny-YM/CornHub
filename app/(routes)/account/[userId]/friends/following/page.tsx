"use client";

import { useQuery } from "@tanstack/react-query";

import { getFollowing } from "@/actions/user";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";
import CardInfo from "@/components/pages/account/friends/card-info";

interface Props {
  params: { userId: string };
}

const AccountFriendFollowingPage = ({ params }: Props) => {
  const queryKey = ["account", "following-list", params.userId];

  // useQuery
  const { data, isLoading } = useQuery({
    enabled: !!params.userId,
    queryKey: queryKey,
    queryFn: () => getFollowing(params.userId, { limit: 20 }),
  });

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center py-4">
        <Loading />
      </div>
    );

  if (!data || !data.length) return <EmptyData className="mt-4" />;

  return (
    <div className="w-full grid grid-cols-2 gap-2 mt-4">
      {data.map(({ id, user }) => (
        <CardInfo
          key={id}
          data={user}
          queryKey={queryKey}
          accountId={params.userId}
        />
      ))}
    </div>
  );
};

export default AccountFriendFollowingPage;
