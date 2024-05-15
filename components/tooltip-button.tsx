"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  button: React.ReactNode;
}

export const TooltipButton = ({ className, button, children }: Props) => {
  return (
    <TooltipProvider>
      {/* ms */}
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent className={cn(className)}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipButton;
