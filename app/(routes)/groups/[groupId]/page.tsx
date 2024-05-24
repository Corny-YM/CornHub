"use client";

import prisma from "@/lib/prisma";
import PostItem from "@/components/post";
import Posting from "@/components/posting";
import EmptyData from "@/components/empty-data";
import CardInfo from "@/components/pages/groups/[groupId]/card-info";
import { useGroupContext } from "@/providers/group-provider";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/actions/group";
import { useMemo } from "react";
import Loading from "@/components/icons/loading";

interface Props {
  params: { groupId: string };
}

const GroupIdPage = ({ params }: Props) => {
  const { groupData, isOwner } = useGroupContext();

  const { data, isLoading } = useQuery({
    queryKey: ["group", "posts", groupData.id],
    queryFn: () => getPosts(groupData.id),
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!data || !data.length) return <EmptyData />;
    return data.map((post) => <PostItem key={post.id} data={post} />);
  }, [data, isLoading]);

  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full xl:w-2/3 flex flex-col">
        <Posting groupId={+params.groupId} />

        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">{content}</div>
      </div>

      <div className="hidden xl:flex w-1/3 flex-col ml-4">
        <CardInfo />
      </div>
    </div>
  );
};

export default GroupIdPage;
