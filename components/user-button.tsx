"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { DoorOpen, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarImg from "@/components/avatar-img";

interface Props {
  className?: string;
}

const UserButton = ({ className }: Props) => {
  const { currentUser } = useAppContext();

  if (!currentUser) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "flex justify-center items-center rounded-full !ring-0 !ring-offset-0",
            className
          )}
          variant="outline"
          size="icon"
        >
          <AvatarImg src={currentUser?.avatar} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[999999] w-80 flex flex-col gap-y-2 py-2 px-1"
        align="end"
      >
        <DropdownMenuItem className={cn("cursor-pointer p-0", className)}>
          <Link
            className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer"
            href={`/account/${currentUser.id}`}
          >
            <AvatarImg
              className="relative flex justify-center items-center w-10 h-10 my-2 mr-3 overflow-hidden rounded-full"
              src={currentUser?.avatar}
            />
            <div className="font-semibold">
              {currentUser?.full_name || "---"}
            </div>
          </Link>
        </DropdownMenuItem>

        {!!currentUser.is_admin && (
          <DropdownMenuItem className={cn("cursor-pointer p-0", className)}>
            <Link
              className="w-full h-fit flex items-center px-2 rounded-md transition select-none cursor-pointer"
              href={`/admin`}
            >
              <div className="flex justify-center items-center w-10 h-10 overflow-hidden rounded-full mr-2">
                <Shield className="text-primary" />
              </div>
              <div className="">
                Quản trị <Badge className="ml-2">CornHub</Badge>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className={cn("cursor-pointer p-0", className)}>
          <SignOutButton>
            <Button
              className="w-full flex items-center justify-start px-2"
              variant="ghost"
            >
              <div className="flex justify-center items-center w-10 h-10 overflow-hidden rounded-full mr-2">
                <DoorOpen />
              </div>

              <div>Đăng xuất</div>
            </Button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
