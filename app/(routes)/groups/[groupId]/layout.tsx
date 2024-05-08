import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Info from "@/components/pages/groups/[groupId]/info";
import Tabs from "@/components/pages/groups/[groupId]/tabs";
import Banner from "@/components/pages/groups/[groupId]/banner";

interface Props {
  children: React.ReactNode;
  params: { groupId: string };
}

const GroupIdLayout = ({ children, params }: Props) => {
  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
          <Banner />

          <Info />

          <Separator className="my-4" />

          <Tabs groupId={params.groupId} />

          {children}
        </div>
      </div>
    </div>
  );
};

export default GroupIdLayout;
