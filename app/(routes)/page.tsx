import Header from "@/components/header";
import NewFeeds from "@/components/pages/home/NewFeeds";
import SidebarLeft from "@/components/pages/home/SidebarLeft";
import SidebarRight from "@/components/pages/home/SidebarRight";

const HomePage = () => {
  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex relative pt-14">
        <SidebarLeft />

        {/* Content */}
        <div className="flex-1 h-full px-8 pt-4">
          <NewFeeds />
        </div>

        <SidebarRight />
      </div>
    </div>
  );
};

export default HomePage;
