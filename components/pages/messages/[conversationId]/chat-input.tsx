"use client";

import toast from "react-hot-toast";
import { useCallback, useRef } from "react";
import { ImageUp, FilePlus2, CirclePlay } from "lucide-react";

import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import UserInputSending from "@/components/user-input-sending";

const ChatInput = () => {
  const { conversationData } = useConversationContext();
  const { isPendingStoreMessage, onStoreMessage } = useMutates();

  const imgRef = useRef<HTMLInputElement | null>(null);
  const vidRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const handleUploadFile = useCallback(
    async (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const size = file.size / (1024 * 1024);
      if (size > 10) return toast.error("File quá 10MB!");

      await onStoreMessage(
        {
          conversationId: conversationData.id,
          file: file,
        },
        () => {}
      );
    },
    [conversationData]
  );

  return (
    <div className="w-full flex items-center space-x-2 mt-2">
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={() => imgRef.current?.click()}
      >
        <ImageUp size={20} />
      </Button>
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={() => vidRef.current?.click()}
      >
        <CirclePlay size={20} />
      </Button>
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={() => fileRef.current?.click()}
      >
        <FilePlus2 size={20} />
      </Button>
      <UserInputSending
        className="w-auto flex-1"
        showAvatar={false}
        disabled={isPendingStoreMessage}
        onSend={handleSendMessage}
      />

      <input
        ref={imgRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        onChange={handleUploadFile}
      />
      <input
        ref={vidRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        type="file"
        accept="video/*"
        onChange={handleUploadFile}
      />
      <input
        ref={fileRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        type="file"
        accept=".doc, .docx, .xls, .xlsx, .pdf, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleUploadFile}
      />
    </div>
  );
};

export default ChatInput;
