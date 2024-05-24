import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Info from "@/components/pages/groups/[groupId]/info";
import Tabs from "@/components/pages/groups/[groupId]/tabs";
import Banner from "@/components/pages/groups/[groupId]/banner";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GroupProvider } from "@/providers/group-provider";

interface Props {
  children: React.ReactNode;
  params: { groupId: string };
}

const GroupIdLayout = async ({ children, params }: Props) => {
  const group = await prisma.group.findFirst({
    include: { _count: { select: { groupMembers: true } } },
    where: { id: +params.groupId },
  });

  if (!group) redirect("/groups");

  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        <GroupProvider data={group}>
          <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
            <Banner />

            <Info />

            <Separator className="my-4" />

            <Tabs />

            {children}
          </div>
        </GroupProvider>
      </div>
    </div>
  );
};

export default GroupIdLayout;
