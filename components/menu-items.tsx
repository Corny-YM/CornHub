"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MonitorPlay, UsersRound, Warehouse } from "lucide-react";

import { cn } from "@/lib/utils";

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
    id: "groups",
    url: "/groups",
    icon: UsersRound,
  },
];

const MenuItems = ({}: Props) => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedItem = useMemo(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    const result = items.find(
      (item) => item.url !== "/" && pathname.includes(item.url)
    );
    return result ? result.id : pathname === "/" ? "home" : "";
  }, [items, mounted]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const url = target.dataset.url;
      if (!url) return;
      router.push(url);
    },
    [router]
  );

  if (!mounted) return null;
  return (
    <div className="absolute right-0 left-0 flex items-center justify-center h-full">
      {items.map((item) => {
        const { id, url, icon: Icon } = item;
        return (
          <div
            key={id}
            className="relative flex justify-center items-center w-28 h-full py-1 select-none"
          >
            <div
              className={cn(
                "flex justify-center items-center w-full h-full",
                "cursor-pointer rounded-md transition",
                selectedItem === id
                  ? "text-primary"
                  : "dark:hover:bg-primary/20 hover:bg-primary/50"
              )}
              data-url={url}
              onClick={handleClick}
            >
              <Icon />
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-[3px] invisible",
                "bg-primary rounded-tl-md rounded-tr-md",
                selectedItem === id && "visible"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
