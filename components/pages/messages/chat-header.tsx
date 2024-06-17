"use client";

import Link from "next/link";
import { Phone, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import ChatInfo from "./chat-info";

const ChatHeader = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <Button className="h-fit px-2" variant="ghost" asChild>
        <Link className="flex items-center space-x-1" href="#">
          <AvatarImg />
          <div className="font-semibold">Bình nghiện</div>
        </Link>
      </Button>

      <div className="h-full flex items-center space-x-2">
        <Button className="rounded-full" variant="ghost" size="icon">
          <Phone size={20} />
        </Button>
        <Button className="rounded-full" variant="ghost" size="icon">
          <Video size={20} />
        </Button>
        <ChatInfo />
      </div>
    </div>
  );
};

export default ChatHeader;
