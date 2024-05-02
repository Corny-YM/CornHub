"use client";

import { Separator } from "@/components/ui/separator";
import UserInfo from "./UserInfo";
import UserActions from "./UserActions";
import ListGroups from "./ListGroups";

const SidebarRight = () => {
  return (
    <div className="sticky h-full basis-80 flex flex-col overflow-hidden overflow-y-auto">
      {/* User Info */}
      <UserInfo />

      <UserActions />

      <Separator className="mx-4 my-2" />

      {/* Groups */}
      <div className="flex flex-col w-full">
        <div className="mx-4 font-semibold mb-2 text-slate-400">
          Lối tắt của bạn
        </div>

        {/* List groups */}
        <ListGroups />
      </div>
    </div>
  );
};

export default SidebarRight;
