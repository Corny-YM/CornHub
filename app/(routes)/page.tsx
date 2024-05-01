import Header from "@/components/header";
import SidebarRight from "./components/SidebarRight";
import SidebarLeft from "./components/SidebarLeft";

const HomePage = () => {
  return (
    <div className="w-full h-full flex items-center pt-14">
      <Header />

      <div className="w-full h-full flex relative pt-4">
        <SidebarRight />

        {/* Content */}
        <div className="h-full flex flex-col items-center flex-1 flex-shrink px-8">
          theanh
        </div>

        <SidebarLeft />
      </div>
    </div>
  );
};

export default HomePage;
