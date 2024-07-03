import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import PostItem from "@/components/post";
import EmptyData from "@/components/empty-data";

interface Props {
  params: { postId: string; groupId: string };
}

const GroupPostIdPage = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const post = await prisma.post.findFirst({
    include: {
      file: true,
      group: true,
      user: true,
      reactions: {
        where: { user_id: userId, comment_id: null, reply_id: null },
        take: 1,
      },
      _count: {
        select: {
          comments: true,
          reactions: { where: { comment_id: null, reply_id: null } },
        },
      },
    },
    where: { id: +params.postId, group_id: +params.groupId },
  });

  if (!post) return <EmptyData />;

  return (
    <div className="w-full h-full mt-4 px-2 md:px-4 md:w-[680px] flex flex-col items-center">
      <PostItem data={post} />
    </div>
  );
};

export default GroupPostIdPage;
