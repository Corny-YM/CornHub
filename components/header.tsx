"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleMode } from "@/components/toggle-mode";
import MenuItems from "@/components/menu-items";
import Logo from "@/components/icons/logo";
import Message from "@/components/icons/message";
import Notification from "@/components/icons/notification";

const Header = () => {
  return (
    <div
      className={cn(
        "z-[9999] w-full fixed top-0 left-0 right-0 dark:bg-[#2c2c2c]",
        "flex items-center justify-between h-14 px-4",
        "border-b border-solid dark:border-neutral-600/50 border-neutral-200/50"
      )}
    >
      <div className="flex items-center h-full gap-2 z-20">
        {/* Logo */}
        <Link href="/" className="flex justify-center items-center h-12">
          <Logo />
        </Link>

        {/* Search bar */}
        <Button
          className="rounded-full cursor-pointer"
          variant="outline"
          size="icon"
        >
          <Search size={20} />
        </Button>
      </div>

      {/* Menu Items */}
      <MenuItems />

      {/* More */}
      <div className="flex items-center gap-2 h-full">
        <ToggleMode />
        <Button
          className="flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none"
          variant="outline"
          size="icon"
        >
          <Message />
        </Button>
        <Button
          className="flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none"
          variant="outline"
          size="icon"
        >
          <Notification />
        </Button>
        <Button
          className="flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none"
          variant="outline"
          size="icon"
        >
          <UserButton afterSignOutUrl="/" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
