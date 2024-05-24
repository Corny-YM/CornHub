import Header from "@/components/header";
import SidebarLeft from "@/components/pages/groups/sidebar-left";
import { GroupsProvider } from "@/providers/groups-provider";

interface Props {
  children: React.ReactNode;
}

const GroupLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full h-full flex items-center">
      <Header />
      <GroupsProvider>
        <div className="w-full h-full flex relative pt-14">
          <SidebarLeft />
          {children}
        </div>
      </GroupsProvider>
    </div>
  );
};

export default GroupLayout;
