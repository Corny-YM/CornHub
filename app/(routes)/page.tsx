import Header from "@/components/header";
import NewFeeds from "@/components/pages/home/NewFeeds";
import SidebarLeft from "@/components/pages/home/SidebarLeft";
import SidebarRight from "@/components/pages/home/SidebarRight";

const HomePage = () => {
  return (
    <div className="w-full h-full flex items-center pt-14">
      <Header />

      <div className="w-full h-full flex relative pt-4">
        <SidebarRight />

        {/* Content */}
        <div className="h-full flex flex-col items-center flex-1 flex-shrink px-8">
          <NewFeeds />
        </div>

        <SidebarLeft />
      </div>
    </div>
  );
};

export default HomePage;
