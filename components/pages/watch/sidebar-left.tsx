"use client";

import { useRouter } from "next/navigation";
import { ElementRef, useCallback, useRef } from "react";
import { AppWindow, Bookmark, MonitorPlay, RadioTower } from "lucide-react";

import { cn, isUndefined } from "@/lib/utils";
import { useToggle } from "@/hooks/useToggle";
import { useWatchContext } from "@/providers/watch-provider";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Trang chủ", url: "", icon: MonitorPlay },
  { label: "Trực tiếp", url: "live", icon: RadioTower },
  { label: "Video đã lưu", url: "saved", icon: Bookmark },
];

const SidebarLeft = () => {
  const router = useRouter();
  const { pathname } = useWatchContext();

  const [active, toggleActive] = useToggle();
  const sidebarRef = useRef<ElementRef<"div">>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      const url = target.dataset.url;
      if (isUndefined(url)) return;
      router.push(`/watch/${url}`);
    },
    [router]
  );
  const hasSelected = useCallback(
    (url: string) => {
      const isRoot = pathname?.split("/")?.length === 2;
      if (!url) return isRoot;
      return pathname?.includes(url);
    },
    [pathname]
  );

  return (
    <>
      <div
        className={cn(
          "z-50 absolute top-16 left-2 transition",
          active && "left-[328px]"
        )}
      >
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            toggleActive();
            sidebarRef.current?.classList.toggle("active");
          }}
        >
          <AppWindow size={20} />
        </Button>
      </div>
      <div ref={sidebarRef} className="side-bar">
        <div className="w-full flex flex-col px-2 pb-4">
          <div className="font-semibold text-xl mb-4 px-2">Video</div>

          <div className="w-full flex flex-col gap-y-2">
            {actions.map(({ label, url, icon: Icon }) => (
              <Button
                key={label}
                data-url={url}
                className={cn(
                  "w-full flex items-center justify-start",
                  hasSelected(url) && "bg-primary/50 hover:bg-primary/60"
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
    </>
  );
};

export default SidebarLeft;
