import { Separator } from "@/components/ui/separator";
import ChatItem from "@/components/pages/messages/chat-item";
import ChatHeader from "@/components/pages/messages/chat-header";
import ChatInput from "@/components/pages/messages/chat-input";

const ConversationIdPage = () => {
  return (
    <div className="flex-grow h-full max-h-full flex flex-col px-2 pt-4 pb-4">
      {/* Header */}
      <ChatHeader />

      <Separator className="my-2" />

      {/* Content */}
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

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default ConversationIdPage;
