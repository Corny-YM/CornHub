import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import FriendCard from "@/components/pages/friends/friend-card";

const FriendsPage = async () => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const friends = await prisma.friend.findMany({
    include: {
      friend: {
        include: {
          followerUserInfo: { where: { follower_id: userId, status: true } },
        },
      },
      user: {
        include: {
          followerUserInfo: { where: { follower_id: userId, status: true } },
        },
      },
    },
    where: { OR: [{ friend_id: userId }, { user_id: userId }] },
  });

  const userFriends = friends.map((item) => {
    if (item.user_id === userId) return item.friend;
    return item.user;
  });

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">Danh sách bạn bè</div>

      {!userFriends.length && <EmptyData />}

      {!!userFriends.length && (
        <div
          className={cn(
            "w-full grid gap-2 pb-4",
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-4",
            "min-[1440px]:grid-cols-5",
            "2xl:grid-cols-6"
          )}
        >
          {userFriends.map((friend) => (
            <FriendCard key={friend.id} data={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
