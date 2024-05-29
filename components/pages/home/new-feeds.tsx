import prisma from "@/lib/prisma";
import PostItem from "@/components/post";
import Posting from "@/components/posting";

interface Props {
  userId: string;
}

const NewFeeds = async ({ userId }: Props) => {
  console.log(userId);
  const userFriends = await prisma.friend.findMany({
    where: {
      OR: [{ user_id: userId }, { friend_id: userId }],
    },
  });

  // Extract friendIds from the user's friends
  const friendIds = userFriends.map(({ user_id, friend_id }) =>
    user_id === userId ? friend_id : user_id
  );

  const allPosts = await prisma.post.findMany({
    include: { file: true, group: true, user: true },
    where: {
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

  const userPosts = await prisma.post.findMany({
    include: { user: true, group: true, file: true },
    where: { user_id: userId },
  });

  // Retrieve posts of user's friends
  const friendsPosts = await prisma.post.findMany({
    include: { user: true, group: true, file: true },
    where: { user_id: { in: friendIds } },
  });

  // Combine user's posts and friends' posts
  const posts = [...userPosts, ...friendsPosts];

  // Sort posts by timestamp (or any other criteria)
  posts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-fit pb-4">
      <div className="w-full max-w-[680px] flex flex-col h-fit">
        {/* Posting */}
        <Posting />

        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">
          {!posts.length && (
            <div className="w-full flex items-center justify-center text-sm mt-2">
              <i>
                Bạn chưa có bản tin nào. Tạo hoặc kết bạn để có nội dung này nhé
              </i>
            </div>
          )}
          {allPosts.map((post) => (
            <PostItem key={post.id} data={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewFeeds;
