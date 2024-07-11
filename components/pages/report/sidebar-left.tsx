"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flag, LayoutDashboard, ThumbsUp, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const SidebarLeft = () => {
  const pathname = usePathname();

  const nav = useMemo(() => {
    return [
      {
        href: "/admin",
        icon: LayoutDashboard,
        label: "Trang chủ",
      },
      {
        href: "/admin/interact",
        icon: ThumbsUp,
        label: "Tương tác",
      },
      {
        href: "/admin/users",
        icon: User,
        label: "Người dùng",
      },
      {
        href: "/admin/groups",
        icon: Users,
        label: "Nhóm",
      },
      {
        href: "/admin/reports",
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
            <Link href={href}>
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
