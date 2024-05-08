"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { cn, isUndefined } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  groupId: string;
}

const tabs = [
  { url: "/", label: "Thảo luận" },
  { url: "/members", label: "Thành viên" },
  { url: "/media", label: "File phương tiện" },
];

const Tabs = ({ groupId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClickTab = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      const url = target.dataset.url;
      if (isUndefined(url) || !groupId) return;
      router.push(`/groups/${groupId}${url}`);
    },
    [router, groupId]
  );
  const hasSelected = useCallback(
    (url: string) => {
      const isRoot = pathname?.split("/")?.length === 3;
      if (url === "/") return isRoot;
      return pathname?.includes(url);
    },
    [pathname]
  );

  return (
    <div className="w-full flex items-center gap-x-2">
      {tabs.map(({ url, label }) => (
        <Button
          key={url}
          data-url={url}
          className={cn(
            "transition ",
            hasSelected(url) &&
              "bg-primary/50 dark:hover:bg-primary/20 hover:bg-primary/70"
          )}
          variant="outline"
          onClick={handleClickTab}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
