"use client";

import ChatItem from "@/components/pages/messages/chat-item";

const ConversationIdPage = () => {
  return (
    <div className="flex-1 flex-grow flex flex-col overflow-hidden overflow-y-auto">
      <div className="flex-1 flex-grow flex flex-col-reverse justify-end">
        {/* MessageItem */}
        <ChatItem />
        <ChatItem isVideo />
        <ChatItem />
        <ChatItem isImage />
        <ChatItem />
      </div>
    </div>
  );
};

export default ConversationIdPage;
