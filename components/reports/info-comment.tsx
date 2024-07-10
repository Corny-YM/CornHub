"use client";

import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { show as showPost } from "@/actions/post";
import { show as showComment } from "@/actions/comments";
import CommentItem from "@/components/comments";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";

interface Props {
  id: number;
  data: Report;
  enabled?: boolean;
}

const InfoComment = ({ id, data, enabled }: Props) => {
  const { data: dataPost, isLoading: isLoadingPost } = useQuery({
    enabled: enabled && !!data.post_id,
    queryKey: ["post", "show", data.post_id],
    queryFn: () => showPost(data.post_id!),
  });

  const { data: dataComment, isLoading: isLoadingComment } = useQuery({
    enabled: enabled && !!id,
    queryKey: ["post", "show", id],
    queryFn: () => showComment(id),
  });

  if (isLoadingPost || isLoadingComment)
    return (
      <div className="w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!dataPost || !dataComment) return <EmptyData />;
  return <CommentItem data={dataComment} dataPost={dataPost} />;
};

export default InfoComment;
