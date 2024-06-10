import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import Header from "@/components/header";
import Info from "@/components/pages/account/info";
import Tabs from "@/components/pages/account/tabs";
import Banner from "@/components/pages/account/banner";
import { AccountProvider } from "@/providers/account-provider";
import { Separator } from "@/components/ui/separator";

interface Props {
  children: React.ReactNode;
  params: { userId: string };
}

const UserLayout = async ({ children, params }: Props) => {
  const accountData = await prisma.user.findUnique({
    include: { userDetails: true },
    where: { id: params.userId },
  });

  if (!accountData) redirect("/");

  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        <AccountProvider data={accountData}>
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
