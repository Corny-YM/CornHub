"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Contact, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFriendContext } from "@/providers/friends-provider";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Danh sách bạn bè", url: "", icon: Contact },
  { label: "Lời mời kết bạn", url: "requests", icon: UserPlus },
];

const SidebarLeft = () => {
  const { pathname } = useFriendContext();

  const hasSelected = useCallback(
    (url: string) => {
      const isRoot = pathname?.split("/")?.length === 2;
      if (!url) return isRoot;
      return pathname?.includes(url);
    },
    [pathname]
  );

  return (
    <div className="side-bar">
      <div className="w-full flex flex-col px-2 pb-4">
        <div className="font-semibold text-xl mb-4 px-2">Bạn bè</div>

        <div className="w-full flex flex-col gap-y-2">
          {actions.map(({ label, url, icon: Icon }) => (
            <Button
              className={cn(
                "w-full flex items-center justify-start",
                hasSelected(url) && "bg-primary/50 hover:bg-primary/60"
              )}
              variant="outline"
              asChild
            >
              <Link key={url} href={`/friends/${url}`}>
                <Icon className="mr-2" size={20} />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
