import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import CardMember from "@/components/pages/groups/[groupId]/card-member";

interface Props {
  params: { groupId: string };
}

const GroupIdMembersPage = async ({ params }: Props) => {
  const { groupId } = params;

  const group = await prisma.group.findUnique({
    include: { owner: true },
    where: { id: +groupId },
  });

  if (!group) redirect("/");

  const members = await prisma.groupMember.findMany({
    include: { member: true },
    where: { group_id: group.id },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="w-full flex flex-col justify-center items-center mt-4 pb-4 px-4 gap-4">
      {/* Admin */}
      <div className="w-full max-w-[680px] flex flex-col px-2 pb-3 pt-1 rounded-lg shadow-sm dark:bg-neutral-800/40 bg-[#f0f2f5]">
        <div className="w-full flex flex-col justify-center">
          <div className="font-semibold px-2 mb-2">
            Quản trị viên & người kiểm duyệt
          </div>
          <div className="w-full flex flex-col gap-2">
            <CardMember groupId={group.id} data={group.owner} />
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="w-full max-w-[680px] flex flex-col px-2 pb-3 pt-1 rounded-lg shadow-sm dark:bg-neutral-800/40 bg-[#f0f2f5]">
        <div className="w-full flex flex-col justify-center">
          <div className="font-semibold px-2 mb-2">Thành viên</div>
          <div className="w-full flex flex-col gap-2">
            {!members?.length && <EmptyData />}
            {members.map((item) => (
              <CardMember key={item.id} groupId={group.id} data={item.member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupIdMembersPage;
