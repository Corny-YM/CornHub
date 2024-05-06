import Header from "@/components/header";
import SidebarLeft from "@/components/pages/groups/sidebar-left";

interface Props {
  children: React.ReactNode;
}

const GroupLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full h-full flex items-center">
      <Header />

      <div className="w-full h-full flex relative pt-14">
        <SidebarLeft />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default GroupLayout;
