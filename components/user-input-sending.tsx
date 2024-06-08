"use client";

import { SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarImg from "@/components/avatar-img";

interface Props {
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onSend?: (e: React.MouseEvent) => void;
}

const UserInputSending = ({
  value,
  disabled,
  onChange,
  onKeyDown,
  onSend,
}: Props) => {
  const { currentUser } = useAppContext();

  if (!currentUser) return null;
  return (
    <div className="flex w-full items-center gap-x-2">
      <AvatarImg src={currentUser.avatar} />
      <Input
        className="flex-1 !ring-0 !ring-offset-0 rounded-full outline-none"
        placeholder="Viết bình luận"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <Button
        className={cn(
          "w-10 h-10 p-0 hover:bg-primary/50 rounded-full",
          !disabled && "bg-primary/50 hover:bg-primary/40"
        )}
        variant="outline"
        size="icon"
        onClick={onSend}
      >
        <SendHorizontal size={20} />
      </Button>
    </div>
  );
};

export default UserInputSending;
