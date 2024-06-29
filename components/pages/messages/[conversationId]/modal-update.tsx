"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogOverlay,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import { useCallback, useMemo, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalUpdate = ({ open, onOpenChange }: Props) => {
  const { conversationData, setConversationData } = useConversationContext();
  const { onUpdateConversation, isPendingUpdateConversation } = useMutates();

  const [value, setValue] = useState(conversationData.name || "");

  const disabled = useMemo(
    () => isPendingUpdateConversation || !value || value.length < 8,
    [isPendingUpdateConversation, value]
  );

  const handleCancel = useCallback(() => {
    setValue(conversationData.name || "");
    onOpenChange(false);
  }, [conversationData]);

  const handleSave = useCallback(async () => {
    if (!value) return;
    await onUpdateConversation(
      {
        id: conversationData.id,
        data: { name: value },
      },
      (res) => {
        onOpenChange(false);
      }
    );
  }, [value, conversationData, onUpdateConversation]);

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    setValue(val);
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] w-screen md:max-w-[784px] sm:w-[600px] sm:max-w-none flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Đổi tên đoạn chat</DialogTitle>
          <DialogDescription>
            Mọi người đều biết khi tên nhóm chat thay đổi.
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <Input value={value} onChange={handleChange} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button disabled={disabled} onClick={handleSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdate;
