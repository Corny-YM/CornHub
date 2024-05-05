"use client";

import { Button } from "@/components/ui/button";
import { Contact, UserPlus, Users } from "lucide-react";

const actions = [
  // {
  //   label: "Trang chủ",
  //   icon: Users,
  // },
  {
    label: "Danh sách bạn bè",
    icon: Contact,
  },
  {
    label: "Lời mời kết bạn",
    icon: UserPlus,
  },
];

const SidebarLeft = () => {
  return (
    <div className="side-bar">
      <div className="w-full flex flex-col px-2 pb-4">
        <div className="font-semibold text-xl mb-4 px-2">Bạn bè</div>

        <div className="w-full flex flex-col gap-y-2">
          {actions.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              className="w-full flex items-center justify-start"
              variant="outline"
            >
              <Icon className="mr-2" size={20} />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
