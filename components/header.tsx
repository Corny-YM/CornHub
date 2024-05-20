"use client";

import Link from "next/link";
import { Bell, Search, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleMode } from "@/components/toggle-mode";
import Logo from "@/components/icons/logo";
import MenuItems from "@/components/menu-items";
import Message from "@/components/icons/message";
import UserButton from "@/components/user-button";
import Notification from "@/components/icons/notification";

const Header = () => {
  return (
    <div
      className={cn(
        "z-[9999] w-full fixed top-0 left-0 right-0 dark:bg-[#2c2c2c] bg-gray-50 shadow",
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
          className="rounded-full cursor-pointer hover:bg-primary/50"
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
        <ToggleMode className="hover:bg-primary/50" />
        <Button
          className="z-50 flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          {/* <Send /> */}
          <Message />
        </Button>
        <Button
          className="z-50 flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          {/* <Bell /> */}
          <Notification />
        </Button>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
