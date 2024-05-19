"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/providers/groups-provider";

const actions = [
  { label: "Nhóm của bạn", url: "joins", icon: Boxes },
  { label: "Bảng feed của bạn", url: "feed", icon: Newspaper },
];

const SidebarLeft = () => {
  const router = useRouter();
  const { pathname } = useGroupContext();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      const url = target.dataset.url;
      if (!url) return;
      router.push(`/groups/${url}`);
    },
    [router]
  );

  return (
    <div className="side-bar">
      <div className="w-full flex flex-col px-2 pb-4">
        <div className="font-semibold text-xl mb-4 px-2">Nhóm</div>

        <div className="w-full flex flex-col gap-y-2">
          {actions.map(({ label, url, icon: Icon }) => (
            <Button
              key={label}
              data-url={url}
              className={cn(
                "w-full flex items-center justify-start",
                pathname?.includes(url) && "bg-primary/50 hover:bg-primary/60"
              )}
              variant="outline"
              onClick={handleClick}
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
