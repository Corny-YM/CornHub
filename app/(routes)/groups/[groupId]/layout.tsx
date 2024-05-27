import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Info from "@/components/pages/groups/[groupId]/info";
import Tabs from "@/components/pages/groups/[groupId]/tabs";
import Banner from "@/components/pages/groups/[groupId]/banner";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GroupProvider } from "@/providers/group-provider";
import { auth } from "@clerk/nextjs/server";

interface Props {
  children: React.ReactNode;
  params: { groupId: string };
}

const GroupIdLayout = async ({ children, params }: Props) => {
  const { userId } = auth();

  const group = await prisma.group.findFirst({
    include: { _count: { select: { groupMembers: true } } },
    where: { id: +params.groupId },
  });

  if (!group) redirect("/groups");

  const member = await prisma.groupMember.findFirst({
    where: { member_id: userId!, group_id: group.id },
  });

  const follower = await prisma.groupFollower.findFirst({
    where: { follower_id: userId!, group_id: group.id },
  });

  // Many users invite you to this group => only get 1 to confirm that requested or not
  const groupRequest = await prisma.groupRequest.findFirst({
    where: { receiver_id: userId!, group_id: group.id },
  });

  const isMember = !!member || userId === group?.owner_id;
  const isFollowing = !!follower;
  const isRequested = !!groupRequest;

  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        <GroupProvider data={{ group, isMember, isFollowing, isRequested }}>
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
