import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import PostItem from "@/components/post";

interface Props {}

const GroupFeedPage = async ({}: Props) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const groupMembers = await prisma.groupMember.findMany({
    where: { member_id: userId },
  });
  const joinedGroups = groupMembers.map((item) => item.group_id);

  const posts = await prisma.post.findMany({
    include: {
      user: true,
      group: true,
      file: true,
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
    where: { group_id: { in: joinedGroups } },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-fit pb-4">
        <div className="w-full max-w-[680px] flex flex-col h-fit">
          <div>Hoạt động gần đây</div>

          {/* List Posts */}
          <div className="w-full flex flex-col mt-4">
            {posts.map((post) => (
              <PostItem data={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupFeedPage;
