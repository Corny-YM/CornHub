import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { GroupsProvider } from "@/providers/groups-provider";
import Header from "@/components/header";
import SidebarLeft from "@/components/pages/groups/sidebar-left";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const GroupLayout = async ({ children }: Props) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const userGroups = await prisma.group.findMany({
    where: { owner_id: userId },
  });

  return (
    <div className="relative w-full h-full flex items-center">
      <Header />
      <GroupsProvider>
        <div className="w-full h-full flex relative pt-14">
          <SidebarLeft groups={userGroups} />
          {children}
        </div>
      </GroupsProvider>
    </div>
  );
};

export default GroupLayout;
