"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/actions/group";
import { useGroupContext } from "@/providers/group-provider";
import PostItem from "@/components/post";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";

interface Props {
  params: { groupId: string };
}

const GroupIdPendingPostsPage = ({ params }: Props) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { groupData, isGroupOwner } = useGroupContext();

  if (!isGroupOwner) router.push(`/groups/${groupData.id}`);

  const { data, isLoading, refetch } = useQuery({
    enabled: isGroupOwner,
    queryKey: ["group", "posts", groupData.id],
    queryFn: () => getPosts(groupData.id, { approve: 0 }),
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
          isApproving
          isGroupOwner={isGroupOwner}
          isGroupOwnerPost={isGroupOwnerPost}
          onSuccessDelete={() => refetch()}
        />
      );
    });
  }, [userId, data, isLoading, groupOwnerId, refetch]);

  return (
    <div className="mt-4 flex justify-center w-full pb-4 relative">
      <div className="w-full md:w-2/3 flex flex-col">
        {/* List Posts */}
        <div className="w-full flex flex-col">{content}</div>
      </div>
    </div>
  );
};

export default GroupIdPendingPostsPage;
