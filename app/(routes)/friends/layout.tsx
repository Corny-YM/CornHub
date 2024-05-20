import Header from "@/components/header";
import SidebarLeft from "@/components/pages/friends/sidebar-left";
import { FriendProvider } from "@/providers/friends-provider";

interface Props {
  children: React.ReactNode;
}

const FriendsLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full h-full flex items-center">
      <Header />

      <div className="w-full h-full flex relative pt-14">
        <FriendProvider>
          <SidebarLeft />

          {/* Content */}
          {children}
        </FriendProvider>
      </div>
    </div>
  );
};

export default FriendsLayout;
