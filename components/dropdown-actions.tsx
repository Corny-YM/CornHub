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
  onClick?: (e: React.MouseEvent) => void;
}

interface Props {
  icon: React.ReactNode;
  actions: IDropdownAction[];
  className?: string;
  disabled?: boolean;
}

export const DropdownActions = ({
  icon,
  actions,
  disabled,
  className,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "flex justify-center items-center rounded-full",
            className
          )}
          disabled={disabled}
          variant="outline"
          size="icon"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[999999] flex flex-col gap-y-2 p-2"
        align="end"
      >
        {actions.map(
          ({ icon, label, className, destructive, onClick }, index) => (
            <DropdownMenuItem
              key={index}
              className={cn(
                "min-w-40 cursor-pointer px-4 py-2",
                destructive && "bg-rose-800 hover:!bg-rose-900",
                className
              )}
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
