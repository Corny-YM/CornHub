import Header from "@/components/header";
import { AccountProvider } from "@/providers/account-provider";
import { Separator } from "@/components/ui/separator";
import Info from "@/components/pages/account/info";
import Tabs from "@/components/pages/account/tabs";
import Banner from "@/components/pages/account/banner";

interface Props {
  children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        <AccountProvider>
          <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
            <Banner />

            <Info />

            <Separator className="my-4" />

            <Tabs />

            {children}
          </div>
        </AccountProvider>
      </div>
    </div>
  );
};

export default UserLayout;
