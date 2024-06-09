"use client";

import { useCallback, useMemo, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarImg from "@/components/avatar-img";

interface Props {
  className?: string;
  disabled?: boolean;
  onSend?: (data: { value: string }) => Promise<any> | undefined;
}

const UserInputSending = ({ disabled, className, onSend }: Props) => {
  const { currentUser } = useAppContext();

  const [inputValue, setInputValue] = useState("");

  // TODO: check if empty data (no value & file)
  const isDisabled = useMemo(() => disabled, [disabled, inputValue]);

  const handleClearData = useCallback(() => {
    setInputValue("");
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    setInputValue(val);
  }, []);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key.toLowerCase() !== "enter" || !currentUser) return;
      await onSend?.({ value: inputValue })?.then(() => handleClearData());
    },
    [inputValue, currentUser, onSend]
  );

  const handleClickSend = useCallback(async () => {
    if (!inputValue.trim() || !currentUser) return;
    await onSend?.({ value: inputValue })?.then(() => handleClearData());
  }, [inputValue, currentUser, onSend]);

  if (!currentUser) return null;
  return (
    <div className={cn("flex w-full items-center gap-x-2", className)}>
      <AvatarImg src={currentUser.avatar} />
      <Input
        className="flex-1 !ring-0 !ring-offset-0 rounded-full outline-none"
        placeholder="Viết bình luận"
        value={inputValue}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button
        className={cn(
          "w-10 h-10 p-0 hover:bg-primary/50 rounded-full",
          !isDisabled && "bg-primary/50 hover:bg-primary/40"
        )}
        variant="outline"
        size="icon"
        onClick={handleClickSend}
      >
        <SendHorizontal size={20} />
      </Button>
    </div>
  );
};

export default UserInputSending;
