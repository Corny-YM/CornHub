"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Contact, MonitorPlay, UsersRound, Warehouse } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const items = [
  { id: "home", label: "Trang chủ", url: "/", icon: Warehouse },
  { id: "watch", label: "Watch", url: "/watch", icon: MonitorPlay },
  { id: "groups", label: "Nhóm", url: "/groups", icon: UsersRound },
  { id: "friends", label: "Bạn bè", url: "/friends", icon: Contact },
];

const MenuItems = ({ className }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedItem = useMemo(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    const result = items.find(
      (item) => item.url !== "/" && pathname.includes(item.url)
    );
    return result ? result.id : pathname === "/" ? "home" : "";
  }, [mounted]);

  if (!mounted) return null;
  return items.map((item) => {
    const { id, url, label, icon: Icon } = item;
    return (
      <div
        key={id}
        className={cn(
          "relative flex justify-center items-center w-20 lg:w-28 h-full py-1 select-none",
          className
        )}
      >
        <Link
          className={cn(
            "flex justify-center items-center w-full h-full",
            "cursor-pointer rounded-md transition p-3 md:py-0",
            selectedItem === id
              ? "text-primary dark:hover:bg-primary-foreground/50 hover:bg-zinc-400/50"
              : "dark:hover:bg-primary/20 hover:bg-primary/50"
          )}
          href={url}
        >
          <Icon />
          <div className="flex md:hidden ml-2 md:ml-0">{label}</div>
        </Link>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[3px] invisible",
            "bg-primary rounded-tl-md rounded-tr-md",
            selectedItem === id && "visible"
          )}
        />
      </div>
    );
  });
};

export default MenuItems;
