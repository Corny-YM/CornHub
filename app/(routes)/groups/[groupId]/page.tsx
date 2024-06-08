"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/actions/group";
import { useGroupContext } from "@/providers/group-provider";
import PostItem from "@/components/post";
import Posting from "@/components/posting";
import EmptyData from "@/components/empty-data";
import CardInfo from "@/components/pages/groups/[groupId]/card-info";
import Loading from "@/components/icons/loading";

interface Props {
  params: { groupId: string };
}

const GroupIdPage = ({ params }: Props) => {
  const { userId } = useAuth();
  const { groupData, isGroupOwner, isMember } = useGroupContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["group", "posts", groupData.id],
    queryFn: () => getPosts(groupData.id),
  });

  const groupOwnerId = useMemo(() => groupData.owner_id, [groupData]);

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!data || !data.length) return <EmptyData />;
    return data.map((post) => {
      const isGroupOwnerPost =
        post.user_id === groupOwnerId && groupOwnerId === userId;
      return (
        <PostItem
          key={post.id}
          data={post}
          isGroupOwner={isGroupOwner}
          isGroupOwnerPost={isGroupOwnerPost}
        />
      );
    });
  }, [userId, data, isLoading, groupOwnerId]);

  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full xl:w-2/3 flex flex-col">
        {isMember && (
          <Posting
            className="mb-4"
            groupId={+params.groupId}
            onPostingSuccess={() => refetch()}
          />
        )}

        {/* List Posts */}
        <div className="w-full flex flex-col">{content}</div>
      </div>

      <div className="hidden xl:flex w-1/3 flex-col ml-4">
        <CardInfo />
      </div>
    </div>
  );
};

export default GroupIdPage;
