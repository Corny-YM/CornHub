import prisma from "@/lib/prisma";
import ListFriends from "./list-friends";

interface Props {
  userId: string;
}

export const revalidate = 0;

const SidebarRight = async ({ userId }: Props) => {
  const friends = await prisma.friend.findMany({
    include: {
      friend: true,
      user: true,
    },
    where: {
      OR: [{ user_id: userId }, { friend_id: userId }],
    },
  });

  return (
    <div className="side-bar">
      <div className="flex flex-col w-full">
        <div className="mx-4 font-semibold mb-2 dark:text-slate-400">
          Người liên hệ
        </div>

        {/* List fiends */}
        <ListFriends friends={friends} />
      </div>
    </div>
  );
};

export default SidebarRight;
