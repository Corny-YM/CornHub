"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImageUp, FilePlus2, CirclePlay } from "lucide-react";

import { store } from "@/actions/message";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import UserInputSending from "@/components/user-input-sending";

const ChatInput = () => {
  const { conversationData } = useConversationContext();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send", "message", conversationData.id],
    mutationFn: store,
    onSuccess() {},
    onError() {
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại sau");
    },
  });

  const handleSendMessage = useCallback(
    async (inputData: { value: string }) => {
      if (!conversationData) return;
      mutateAsync({
        conversationId: conversationData.id,
        content: inputData.value,
      });
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
        disabled={isPending}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatInput;
