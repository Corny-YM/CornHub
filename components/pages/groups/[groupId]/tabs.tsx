"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/providers/group-provider";

interface Props {}

const Tabs = ({}: Props) => {
  const { tabs, pathname, groupData, isGroupOwner } = useGroupContext();

  const hasSelected = useCallback(
    (url: string) => {
      const isRoot = pathname?.split("/")?.length === 3;
      if (url === "/") return isRoot;
      return pathname?.includes(url);
    },
    [pathname]
  );

  const btnTabs = useMemo(() => {
    const arr = [...tabs];

    if (isGroupOwner) {
      if (groupData.approve_posts)
        arr.push({ url: `/pending/posts`, label: "Kiểm duyệt bài viết" });
      arr.push({ url: `/reports`, label: "Báo cáo" });
    }

    return arr;
  }, [isGroupOwner, groupData]);

  return (
    <div className="w-full flex items-center gap-x-2">
      {btnTabs.map(({ url, label }) => (
        <Button
          key={url}
          className={cn(
            "transition ",
            hasSelected(url) &&
              "bg-primary/50 dark:hover:bg-primary/20 hover:bg-primary/70"
          )}
          variant="outline"
          asChild
        >
          <Link href={`/groups/${groupData.id}${url}`}>{label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
