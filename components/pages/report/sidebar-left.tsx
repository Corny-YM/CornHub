"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementRef, useMemo, useRef } from "react";
import {
  Flag,
  User,
  Users,
  ThumbsUp,
  AppWindow,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useToggle } from "@/hooks/useToggle";
import { Button } from "@/components/ui/button";

const SidebarLeft = () => {
  const pathname = usePathname();

  const [active, toggleActive] = useToggle();
  const sidebarRef = useRef<ElementRef<"div">>(null);

  const nav = useMemo(() => {
    return [
      {
        href: "/",
        icon: LayoutDashboard,
        label: "Trang chủ",
      },
      {
        href: "/interact",
        icon: ThumbsUp,
        label: "Tương tác",
      },
      {
        href: "/users",
        icon: User,
        label: "Người dùng",
      },
      {
        href: "/groups",
        icon: Users,
        label: "Nhóm",
      },
      {
        href: "/reports",
        icon: Flag,
        label: "Báo cáo",
      },
    ];
  }, []);

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
        <div className="h-full flex flex-col overflow-hidden overflow-y-auto px-2 space-y-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              className={cn(
                "flex items-center justify-start h-fit py-3 hover:bg-primary/50 dark:hover:bg-primary-foreground",
                pathname.includes(href) &&
                  "bg-primary/50 dark:bg-primary-foreground"
              )}
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/admin${href}`}>
                <Icon className="mr-2" size={20} />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
