import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import Header from "@/components/header";
import SidebarLeft from "@/components/pages/report/sidebar-left";

interface Props {
  children: React.ReactNode;
}

const RoutesAdminLayout = async ({ children }: Props) => {
  const { userId } = auth();

  if (!userId) redirect("/");

  const admin = await prisma.user.findFirst({
    where: { id: userId, is_admin: true },
  });

  if (!admin) redirect("/");

  return (
    <div className="relative w-full flex items-center">
      <Header isAdmin />

      <div className="w-full h-full flex relative pt-14">
        <SidebarLeft />

        {/* Content */}
        <div className="flex-1 h-full px-8 pt-4">{children}</div>
      </div>
    </div>
  );
};

export default RoutesAdminLayout;
