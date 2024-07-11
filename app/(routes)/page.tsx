import { DoorOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import NewFeeds from "@/components/pages/home/new-feeds";
import SidebarLeft from "@/components/pages/home/sidebar-left";
import SidebarRight from "@/components/pages/home/sidebar-right";
import AvatarImg from "@/components/avatar-img";

const HomePage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (user?.is_banned)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center space-y-2">
        <div>
          Tài khoản của bạn đã bị cấm. Vui lòng liên hệ Admin để biết thêm chi
          tiết
        </div>
        <Badge>vietcong1508@gmail.com</Badge>
        <SignOutButton>
          <Button variant="outline">
            <DoorOpen className="mr-2" />
            <div>Đăng xuất</div>
          </Button>
        </SignOutButton>
      </div>
    );

  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex relative pt-14">
        <SidebarLeft userId={userId} />

        {/* Content */}
        <div className="flex-1 h-full px-8 pt-4">
          <NewFeeds userId={userId} />
        </div>

        <SidebarRight userId={userId} />
      </div>
    </div>
  );
};

export default HomePage;
