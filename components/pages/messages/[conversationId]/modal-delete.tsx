"use client";

import { Message } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OptionDeleteMessageEnum } from "@/lib/enum";
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  message: Message;
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalDelete = ({ open, message, onOpenChange }: Props) => {
  const [option, setOption] = useState(
    !message.deleted
      ? OptionDeleteMessageEnum.recall
      : OptionDeleteMessageEnum.terminate
  );

  useEffect(() => {
    setOption(
      !message.deleted
        ? OptionDeleteMessageEnum.recall
        : OptionDeleteMessageEnum.terminate
    );
  }, [message.deleted]);

  const { onDeleteMessage, isPendingDeleteMessage } = useMutates();

  const disabled = useMemo(
    () => isPendingDeleteMessage,
    [isPendingDeleteMessage]
  );

  const handleRemove = useCallback(async () => {
    const { id, conversation_id } = message;
    if (!option || !message) return;
    await onDeleteMessage(
      {
        id,
        type: option,
        conversationId: conversation_id,
      },
      () => {
        onOpenChange(false);
      }
    );
  }, [message, option]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999]">
        <DialogHeader>
          <DialogTitle>Bạn muốn gỡ tin nhắn này ở phía ai?</DialogTitle>
          <DialogDescription className="text-xs">
            Chọn phương thức muốn xóa
          </DialogDescription>
        </DialogHeader>

        <div className="w-full space-y-2">
          {!message.deleted && (
            <div className="leading-normal">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={OptionDeleteMessageEnum.recall}
                  checked={option === OptionDeleteMessageEnum.recall}
                  onCheckedChange={(val) => {
                    if (val) setOption(OptionDeleteMessageEnum.recall);
                  }}
                />
                <label
                  htmlFor={OptionDeleteMessageEnum.recall}
                  className="flex-1 flex w-full font-semibold select-none cursor-pointer"
                >
                  Thu hồi với mọi người
                </label>
              </div>
              <div className="w-full pl-6">
                <div className="text-sm text-justify font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tin nhắn này sẽ bị thu hồi với mọi người trong đoạn chat.
                  Những người khác có thể đã xem hoặc chuyển tiếp tin nhắn đó.
                  Tin nhắn đã thu hồi vẫn có thể bị báo cáo.
                </div>
              </div>
            </div>
          )}

          <div className="leading-normal">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={OptionDeleteMessageEnum.terminate}
                checked={option === OptionDeleteMessageEnum.terminate}
                onCheckedChange={(val) => {
                  if (val) setOption(OptionDeleteMessageEnum.terminate);
                }}
              />
              <label
                htmlFor={OptionDeleteMessageEnum.terminate}
                className="flex-1 flex w-full font-semibold select-none cursor-pointer"
              >
                Xóa bỏ hoàn toàn
              </label>
            </div>
            <div className="w-full pl-6">
              <div className="text-sm text-justify font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tin nhắn này sẽ bị xóa vĩnh viễn dữ liệu ở máy chủ của chúng
                tôi.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            disabled={disabled}
            variant="destructive"
            onClick={handleRemove}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDelete;
