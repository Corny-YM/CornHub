"use client";

import Link from "next/link";
import Image from "next/image";
import { DoorOpen } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarImg from "./avatar-img";

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
            "flex justify-center items-center rounded-full",
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
              className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full"
              src={currentUser?.avatar}
            />
            <div className="font-semibold">
              {currentUser?.full_name || "---"}
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className={cn("cursor-pointer p-0", className)}>
          <SignOutButton>
            <Button
              className="w-full flex items-center justify-start px-2"
              variant="ghost"
            >
              <div className="flex justify-center items-center w-9 h-9 overflow-hidden rounded-full mr-2">
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
