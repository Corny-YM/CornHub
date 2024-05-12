import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import Header from "@/components/header";
import NewFeeds from "@/components/pages/home/new-feeds";
import SidebarLeft from "@/components/pages/home/sidebar-left";
import SidebarRight from "@/components/pages/home/sidebar-right";

const HomePage = () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

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
