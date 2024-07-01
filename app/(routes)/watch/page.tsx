import EmptyData from "@/components/empty-data";
import PostItem from "@/components/post";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const WatchPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const allPosts = await prisma.post.findMany({
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
    where: {
      file: { type: { contains: "video" } },
      OR: [
        // Get all posts current users
        { user_id: userId },
        // Get all posts user friends
        {
          user: {
            OR: [
              {
                friends: {
                  some: { OR: [{ user_id: userId }, { friend_id: userId }] },
                },
              },
              {
                friendUserInfo: {
                  some: { OR: [{ user_id: userId }, { friend_id: userId }] },
                },
              },
            ],
          },
          group_id: null,
        },
        // Get all group posts that user joined
        {
          group: {
            groupMembers: { some: { member_id: userId } },
          },
        },
      ],
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-fit pb-4">
      <div className="w-full max-w-[680px] flex flex-col h-fit">
        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">
          {!allPosts.length && <EmptyData />}
          {allPosts.map((post) => (
            <PostItem key={post.id} data={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
