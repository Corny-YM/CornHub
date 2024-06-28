"use client";

import { Hash } from "lucide-react";

import { useConversationContext } from "@/providers/conversation-provider";
import AvatarImg from "@/components/avatar-img";

const ChatWelcome = () => {
  const { isGroupChat, conversationName, conversationAvatar } =
    useConversationContext();

  return (
    <div className="space-y-2 px-4 mb-4 flex flex-col items-center">
      <div className="w-[75px] h-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
        {isGroupChat ? (
          <Hash className="h-12 w-12 text-white" />
        ) : (
          <AvatarImg className="w-full h-full" src={conversationAvatar} />
        )}
      </div>
      <p className="text-xl md:text-3xl">
        {isGroupChat ? "Welcome to #" : ""}
        <span className="font-bold">{conversationName}</span>
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {isGroupChat
          ? `This is the start of the #${conversationName} channel.`
          : `This is the start of the conversation with ${conversationName}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
