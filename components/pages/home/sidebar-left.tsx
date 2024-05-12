import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import UserActions from "./user-actions";
import ListGroups from "./list-groups";

interface Props {
  userId: string;
}

export const revalidate = 0;

const SidebarLeft = async ({ userId }: Props) => {
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { groupMembers: { some: { member_id: userId } } },
        { owner_id: userId },
      ],
    },
  });

  return (
    <div className="side-bar">
      <UserActions />

      <Separator className="mx-4 my-2" />

      {/* Groups */}
      <div className="flex flex-col w-full">
        <div className="mx-4 font-semibold mb-2 dark:text-slate-400">
          Lối tắt của bạn
        </div>

        {/* List groups */}
        <ListGroups groups={groups} />
      </div>
    </div>
  );
};

export default SidebarLeft;
