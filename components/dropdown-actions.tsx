"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface IDropdownAction {
  label: string;
  className?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface Props {
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  actions: IDropdownAction[];
  menuSide?: "top" | "right" | "bottom" | "left";
  align?: "end" | "center" | "start" | undefined;
  size?: "icon" | "default" | "sm" | "lg" | null;
  onOpenChange?: (val?: boolean) => void;
}

export const DropdownActions = ({
  icon,
  actions,
  disabled,
  className,
  size = "icon",
  align = "end",
  menuSide = "bottom",
  onOpenChange,
}: Props) => {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "flex justify-center items-center select-none",
            size === "icon" && "rounded-full",
            className
          )}
          disabled={disabled}
          variant="outline"
          size={size}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[999999] flex flex-col gap-y-2 p-2"
        align={align}
        side={menuSide}
      >
        {actions.map(
          (
            { icon, label, className, destructive, disabled, onClick },
            index
          ) => (
            <DropdownMenuItem
              key={index}
              className={cn(
                "min-w-40 cursor-pointer px-4 py-2",
                destructive &&
                  "bg-rose-800 hover:!bg-rose-900 text-neutral-200 hover:!text-neutral-300",
                className
              )}
              disabled={disabled}
              onClick={onClick}
            >
              <div className="flex items-center justify-start w-full">
                {icon}
                <div>{label}</div>
              </div>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
