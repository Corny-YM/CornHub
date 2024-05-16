"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/actions/user";
import { useAccountContext } from "@/providers/account-provider";
import PostItem from "@/components/post";
import Posting from "@/components/posting";
import InfoDetail from "@/components/pages/account/info-detail";

interface Props {
  params: { userId: string };
}

const UserPage = ({ params }: Props) => {
  const { accountData, isOwner } = useAccountContext();

  const { data: dataPosts, isLoading } = useQuery({
    queryKey: ["account", "posts", params.userId],
    queryFn: () => getPosts(params.userId),
  });

  const content = useMemo(() => {
    if (isLoading) return null;
    if (!dataPosts || !dataPosts.length) return <div></div>;
    return dataPosts.map((post) => <PostItem key={post.id} data={post} />);
  }, [isLoading, dataPosts]);

  return (
    <div className="mt-4 flex w-full pb-4 relative">
      {/* Info Detail */}
      <div className="w-1/3 flex-shrink relative">
        <div className="w-full h-0"></div>
        <InfoDetail data={accountData} />
      </div>

      {/* Posts */}
      <div className="flex-1 flex flex-col ml-4">
        {isOwner && <Posting />}

        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">{content}</div>
      </div>
    </div>
  );
};

export default UserPage;
