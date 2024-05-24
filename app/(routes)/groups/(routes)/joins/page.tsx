import { auth } from "@clerk/nextjs/server";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import GroupCard from "@/components/pages/groups/group-card";
import { redirect } from "next/navigation";
import EmptyData from "@/components/empty-data";

const GroupJoinPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const groupMembers = await prisma.groupMember.findMany({
    include: { group: true },
    where: { member_id: userId },
  });

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
            <GroupCard key={item.id} data={item.group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupJoinPage;
