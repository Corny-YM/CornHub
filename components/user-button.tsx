"use client";

import Image from "next/image";
import { useCallback } from "react";
import { DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  className?: string;
}

const UserButton = ({ className }: Props) => {
  const router = useRouter();

  const { user } = useUser();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const url = target.dataset.url;
      if (!url) return;
      router.push(url);
    },
    [router]
  );

  if (!user) return;
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
          <div className="w-full h-full flex justify-center items-center relative rounded-full overflow-hidden">
            <Image
              className="absolute w-full h-full"
              src={user.imageUrl}
              alt={user.fullName || "user-avatar"}
              fill
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[999999] w-80 flex flex-col gap-y-2 py-2 px-1"
        align="end"
      >
        <DropdownMenuItem className={cn("cursor-pointer p-0", className)}>
          <div
            className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer"
            data-url={`/account/${user.id}`}
            onClick={handleClick}
          >
            <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
              <Image
                className="absolute w-full h-full aspect-square"
                priority
                src={user.imageUrl!}
                alt={user.fullName || ""}
                fill
              />
            </div>
            <div className="font-semibold">{user.fullName || "---"}</div>
          </div>
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
