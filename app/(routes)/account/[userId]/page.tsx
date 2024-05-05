import { AccountProvider } from "@/providers/account-provider";
import { Separator } from "@/components/ui/separator";
import Info from "@/components/pages/account/info";
import Tabs from "@/components/pages/account/tabs";
import Banner from "@/components/pages/account/banner";
import TabItem from "@/components/pages/account/tab-item";

const UserPage = () => {
  return (
    <AccountProvider>
      <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
        <Banner />

        <Info />

        <Separator className="my-4" />

        <Tabs />

        <TabItem />
      </div>
    </AccountProvider>
  );
};

export default UserPage;
