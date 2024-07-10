"use client";

import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { show } from "@/actions/post";
import PostItem from "@/components/post";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";

interface Props {
  id: number;
  data: Report;
  enabled?: boolean;
}

const InfoPost = ({ id, enabled }: Props) => {
  const { data, isLoading } = useQuery({
    enabled: enabled && !!id,
    queryKey: ["post", "show", id],
    queryFn: () => show(id),
  });

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!data) return <EmptyData />;
  return <PostItem data={data} isModal />;
};

export default InfoPost;
