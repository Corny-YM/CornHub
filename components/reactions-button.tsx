"use client";

import { useMemo } from "react";

import { emotions } from "@/lib/const";
import { formatAmounts } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  totalReactions: number;
  onClick?: (e?: React.MouseEvent) => void;
}

const ReactionsButton = ({ totalReactions, onClick }: Props) => {
  const content = useMemo(() => {
    const listEmotion = [...emotions];
    return listEmotion.splice(0, 3).map((item, index) => {
      const { icon: Icon } = item;
      return (
        <div
          key={item.type}
          className="emotions"
          style={{ zIndex: emotions.length - index }}
        >
          <Icon />
        </div>
      );
    });
  }, []);

  if (!totalReactions) return null;
  return (
    <Button
      className="px-2 py-1 h-fit flex items-center gap-1 text-xs text-inherit cursor-pointer select-none rounded-full leading-normal dark:hover:bg-primary-foreground"
      variant="outline"
      size="sm"
      onClick={onClick}
    >
      <div>{formatAmounts(totalReactions)}</div>
      {/* Emotions */}
      <div className="flex items-center">{content}</div>
    </Button>
  );
};

export default ReactionsButton;
