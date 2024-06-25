"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  className?: string;
  delayDuration?: number;
  button: React.ReactNode;
  children: React.ReactNode;
  disableHoverableContent?: boolean;
  side?: "top" | "right" | "bottom" | "left";
}

export const TooltipButton = ({
  button,
  children,
  className,
  side = "top",
  delayDuration = 250,
  disableHoverableContent,
}: Props) => {
  return (
    <TooltipProvider>
      {/* ms */}
      <Tooltip
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={side} className={cn(className)}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipButton;
