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
  open?: boolean;
  onOpenChange?: (val?: boolean) => void;
}

export const TooltipButton = ({
  button,
  children,
  className,
  side = "top",
  delayDuration = 250,
  disableHoverableContent,
  open,
  onOpenChange,
}: Props) => {
  return (
    <TooltipProvider>
      {/* ms */}
      <Tooltip
        open={open}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
        onOpenChange={onOpenChange}
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
