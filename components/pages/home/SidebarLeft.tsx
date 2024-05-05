"use client";

import { Separator } from "@/components/ui/separator";
import UserActions from "./UserActions";
import ListGroups from "./ListGroups";

const SidebarLeft = () => {
  return (
    <div className="side-bar">
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

export default SidebarLeft;
