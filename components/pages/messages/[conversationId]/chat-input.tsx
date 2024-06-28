"use client";

import { useCallback } from "react";
import { ImageUp, FilePlus2, CirclePlay } from "lucide-react";

import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import UserInputSending from "@/components/user-input-sending";

const ChatInput = () => {
  const { conversationData } = useConversationContext();

  const { isPendingStoreMessage, onStoreMessage } = useMutates();

  const handleSendMessage = useCallback(
    async (inputData: { value: string }) => {
      if (!conversationData) return;
      await onStoreMessage(
        {
          conversationId: conversationData.id,
          content: inputData.value,
        },
        () => {}
      );
    },
    [conversationData]
  );

  return (
    <div className="w-full flex items-center space-x-2 mt-2">
      <Button className="rounded-full" variant="ghost" size="icon">
        <ImageUp size={20} />
      </Button>
      <Button className="rounded-full" variant="ghost" size="icon">
        <CirclePlay size={20} />
      </Button>
      <Button className="rounded-full" variant="ghost" size="icon">
        <FilePlus2 size={20} />
      </Button>
      <UserInputSending
        showAvatar={false}
        disabled={isPendingStoreMessage}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatInput;
