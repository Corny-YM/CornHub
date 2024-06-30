"use client";

import { Hash } from "lucide-react";

import { useConversationContext } from "@/providers/conversation-provider";
import AvatarImg from "@/components/avatar-img";

const ChatWelcome = () => {
  const { isGroupChat, conversationName, conversationAvatar } =
    useConversationContext();

  return (
    <div className="w-96 space-y-2 px-4 mb-4 flex flex-col items-center">
      <div className="w-[75px] h-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
        {isGroupChat ? (
          <Hash className="h-12 w-12 text-white" />
        ) : (
          <AvatarImg className="w-full h-full" src={conversationAvatar} />
        )}
      </div>
      <p className="text-xl md:text-3xl break-words line-clamp-3">
        {isGroupChat ? "Chào mừng bạn đến #" : ""}
        <span className="font-bold">{conversationName}</span>
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3">
        {isGroupChat
          ? `Đây là phần bắt đầu của cuộc trò chuyện #${conversationName}.`
          : `Đây là phần bắt đầu cuộc trò chuyện với ${conversationName}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
