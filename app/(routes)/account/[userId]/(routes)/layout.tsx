import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import Info from "@/components/pages/account/info";
import Tabs from "@/components/pages/account/tabs";
import Banner from "@/components/pages/account/banner";
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
    <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
      <Banner />

      <Info />

      <Separator className="my-4" />

      <Tabs />

      {children}
    </div>
  );
};

export default UserLayout;
