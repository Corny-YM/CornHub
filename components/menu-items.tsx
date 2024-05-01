"use client";

import { cn } from "@/lib/utils";
import { MonitorPlay, UsersRound, Warehouse } from "lucide-react";

interface Props {}

const items = [
  {
    id: "home",
    url: "/",
    icon: Warehouse,
  },
  {
    id: "watch",
    url: "/watch",
    icon: MonitorPlay,
  },
  {
    id: "group",
    url: "/group",
    icon: UsersRound,
  },
];

const MenuItems = ({}: Props) => {
  return (
    <div className="absolute right-0 left-0 flex items-center justify-center h-full">
      {items.map((item) => {
        const { id, url, icon: Icon } = item;
        return (
          <div
            key={id}
            className="relative flex justify-center items-center w-28 h-full py-1"
          >
            <div
              className={cn(
                "flex justify-center items-center w-full h-full",
                "cursor-pointer rounded-md transition",
                url === "/"
                  ? "text-primary"
                  : "dark:hover:bg-primary/20 hover:bg-primary/50"
              )}
            >
              <Icon />
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-[3px] invisible",
                "bg-primary rounded-tl-md rounded-tr-md",
                url === "/" && "visible"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
