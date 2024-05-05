"use client";

import { LucideProps, MonitorX, UserX } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

export interface IAction {
  label: string;
  destructive?: boolean;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  onClick?: (e: React.MouseEvent) => void;
}

const actions: IAction[] = [
  {
    label: "Bỏ theo dõi",
    icon: MonitorX,
  },
  {
    label: "Hủy bạn bè",
    icon: UserX,
    destructive: true,
  },
];

const FriendButtonActions = ({ children }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[999999] flex flex-col gap-y-1 p-2"
        align="end"
      >
        {actions.map(({ label, destructive, icon: Icon, onClick }, index) => (
          <DropdownMenuItem key={index} className="p-0">
            <Button
              className="w-60 flex items-center justify-start"
              variant={destructive ? "destructive" : "outline"}
              size="sm"
              onClick={onClick}
            >
              {Icon && <Icon className="mr-2" size={20} />}
              <div>{label}</div>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FriendButtonActions;
