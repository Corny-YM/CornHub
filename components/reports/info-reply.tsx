"use client";

import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { show as showPost } from "@/actions/post";
import { show as showReply } from "@/actions/replies";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";
import CommentRepliesItem from "@/components/comment-replies/item";

interface Props {
  id: number;
  data: Report;
  enabled?: boolean;
}

const InfoReply = ({ id, data, enabled }: Props) => {
  const { data: dataPost, isLoading: isLoadingPost } = useQuery({
    enabled: enabled && !!data.post_id,
    queryKey: ["post", "show", data.post_id],
    queryFn: () => showPost(data.post_id!),
  });

  const { data: dataReply, isLoading: isLoadingReply } = useQuery({
    enabled: enabled && !!id,
    queryKey: ["post", "show", id],
    queryFn: () => showReply(id),
  });

  if (isLoadingReply || isLoadingPost)
    return (
      <div className="w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!dataPost || !dataReply) return <EmptyData />;
  return <CommentRepliesItem data={dataReply} dataPost={dataPost} />;
};

export default InfoReply;
