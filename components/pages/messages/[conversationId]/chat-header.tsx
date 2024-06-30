"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Phone, Video } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useToggle } from "@/hooks/useToggle";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import SocketIndicator from "@/components/socket-indicator";
import AvatarImg from "@/components/avatar-img";
import ChatInfo from "./chat-info";
import ModalMembers from "./modal-members";

const ChatHeader = () => {
  const { userId } = useAuth();

  const [modalMembers, toggleModalMembers] = useToggle(false);

  const {
    conversationData,
    conversationAvatar,
    conversationName,
    isGroupChat,
  } = useConversationContext();

  const content = useMemo(() => {
    const defaultContent = (
      <>
        <AvatarImg
          isChat={isGroupChat}
          src={conversationAvatar}
          alt={conversationName}
        />
        <div className="font-semibold line-clamp-1">
          {conversationName || "---"}
        </div>
      </>
    );
    if (isGroupChat)
      return (
        <div className="flex items-center space-x-2 line-clamp-1">
          {defaultContent}
        </div>
      );

    const personId =
      conversationData.created_by === userId
        ? conversationData.user_id
        : conversationData.created_by;
    return (
      <Link
        className="flex items-center space-x-2 line-clamp-1"
        href={`/account/${personId}`}
      >
        {defaultContent}
      </Link>
    );
  }, [
    userId,
    isGroupChat,
    conversationData,
    conversationName,
    conversationAvatar,
  ]);

  const handleClick = useCallback(() => {
    if (!isGroupChat) return;
    toggleModalMembers(true);
  }, [isGroupChat]);

  return (
    <div className="w-full flex items-center justify-between">
      <Button
        className="h-fit px-2 max-w-96"
        variant="ghost"
        asChild={!isGroupChat}
        onClick={handleClick}
      >
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

      <ModalMembers open={modalMembers} onOpenChange={toggleModalMembers} />
    </div>
  );
};

export default ChatHeader;
