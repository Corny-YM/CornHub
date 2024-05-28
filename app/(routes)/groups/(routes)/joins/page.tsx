import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { GroupMember } from "@prisma/client";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import GroupCard from "@/components/pages/groups/group-card";
import EmptyData from "@/components/empty-data";

const GroupJoinPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const groupMembers = await prisma.groupMember.findMany({
    include: { group: true },
    where: { member_id: userId },
    orderBy: { created_at: "desc" },
  });

  const groupUserFollowings = await prisma.groupFollower.findMany({
    where: { follower_id: userId, status: true },
  });

  const followingGroups: Record<number, GroupMember> =
    groupUserFollowings.reduce((obj, item) => {
      return { ...obj, [item.group_id]: item };
    }, {});

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">
        Tất cả các nhóm bạn đã tham gia
      </div>

      {!groupMembers.length && <EmptyData />}
      {!!groupMembers.length && (
        <div
          className={cn(
            "w-full grid gap-2 pb-4",
            "grid-cols-1",
            "xl:grid-cols-2",
            "min-[1440px]:grid-cols-3"
          )}
        >
          {groupMembers.map((item) => (
            <GroupCard
              key={item.id}
              data={item.group}
              following={!!followingGroups?.[item.group_id]}
              member
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupJoinPage;
