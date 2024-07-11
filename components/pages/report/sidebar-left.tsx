"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Flag, LayoutDashboard, ThumbsUp, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarLeft = () => {
  const pathname = usePathname();

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

  console.log(pathname);

  return (
    <div className="side-bar">
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
  );
};

export default SidebarLeft;
