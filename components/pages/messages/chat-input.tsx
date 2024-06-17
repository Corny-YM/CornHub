"use client";

import { ImageUp, FilePlus2, CirclePlay } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserInputSending from "@/components/user-input-sending";

const ChatInput = () => {
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
      <UserInputSending showAvatar={false} />
    </div>
  );
};

export default ChatInput;
