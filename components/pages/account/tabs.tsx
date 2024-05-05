"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccountContext } from "@/providers/account-provider";
import { useCallback } from "react";

const Tabs = () => {
  const { tabs, selectedTab, onSelectedTab } = useAccountContext();

  const handleClickTab = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    const id = target.dataset.id;
    if (!id) return;
    onSelectedTab(id);
  }, []);

  return (
    <div className="w-full flex items-center gap-x-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          data-id={tab.id}
          className={cn(
            "transition ",
            selectedTab === tab.id &&
              "bg-primary/50 dark:hover:bg-primary/20 hover:bg-primary/70"
          )}
          variant="outline"
          onClick={handleClickTab}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
