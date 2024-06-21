"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Phone, Video } from "lucide-react";

import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import ChatInfo from "./chat-info";
import SocketIndicator from "@/components/socket-indicator";

const ChatHeader = () => {
  const { conversationAvatar, conversationName, isGroupChat } =
    useConversationContext();

  const content = useMemo(() => {
    const defaultContent = (
      <>
        <AvatarImg
          isChat={isGroupChat}
          src={conversationAvatar}
          alt={conversationName}
        />
        <div className="font-semibold">{conversationName || "---"}</div>
      </>
    );
    if (isGroupChat)
      return (
        <div className="flex items-center space-x-2">{defaultContent}</div>
      );
    return (
      <Link className="flex items-center space-x-2" href="#">
        {defaultContent}
      </Link>
    );
  }, [isGroupChat, conversationAvatar, conversationName]);

  return (
    <div className="w-full flex items-center justify-between">
      <Button className="h-fit px-2" variant="ghost" asChild={!isGroupChat}>
        {content}
      </Button>

      <div className="h-full flex items-center space-x-2">
        <SocketIndicator />
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
