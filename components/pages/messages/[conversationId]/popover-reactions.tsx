import { Smile } from "lucide-react";
import React, { useCallback } from "react";

import { emotions } from "@/lib/const";
import { IMessage } from "@/actions/message";
import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  message: IMessage;
}

const PopoverReactions = ({ message }: Props) => {
  const [open, toggleOpen] = useToggle(false);

  const { onStoreReaction, isPendingStoreReaction } = useMutates();

  const handleClickReact = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const type = target.dataset.type;
      if (!type) return;
      toggleOpen(false);
      await onStoreReaction(
        {
          type,
          id: message.id,
          conversationId: message.conversation_id,
        },
        () => {}
      );
    },
    [message]
  );

  return (
    <Popover open={open} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <Button
          className="rounded-full"
          variant="ghost"
          size="icon"
          disabled={isPendingStoreReaction}
          onClick={() => toggleOpen(true)}
        >
          <Smile size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 rounded-full z-[9999]" side="top">
        <div className="flex items-center justify-center gap-1">
          {emotions.map(({ label, type, icon: Icon }) => (
            <div
              key={label}
              data-type={type}
              className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-solid cursor-pointer transition-all hover:scale-110"
              onClick={handleClickReact}
            >
              <Icon />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverReactions;
