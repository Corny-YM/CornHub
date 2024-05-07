import { WatchProvider } from "@/providers/watch-provider";
import Header from "@/components/header";
import SidebarLeft from "@/components/pages/watch/sidebar-left";

interface Props {
  children: React.ReactNode;
}

const WatchLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full flex items-center">
      <Header />

      <WatchProvider>
        <div className="w-full h-full flex relative pt-14">
          <SidebarLeft />

          {/* Content */}
          {children}
        </div>
      </WatchProvider>
    </div>
  );
};

export default WatchLayout;
