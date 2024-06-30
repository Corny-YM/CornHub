"use client";

import { User } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogOverlay,
  DialogDescription,
} from "@/components/ui/dialog";
import SelectFriends from "../select-friends";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalAddMembers = ({ open, onOpenChange }: Props) => {
  const { conversationData, isGroupChat } = useConversationContext();
  const { isPendingAddMembers, onAddMembers } = useMutates();

  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const disabled = useMemo(
    () => !Object.keys(selectedIds).length || isPendingAddMembers,
    [selectedIds, isPendingAddMembers]
  );

  const handleAdd = useCallback(async () => {
    const ids = Object.keys(selectedIds);
    if (!conversationData || !ids.length || !isGroupChat) return;
    await onAddMembers({ ids, conversationId: conversationData.id }, () => {
      onOpenChange(false);
      setSelectedIds({});
    });
  }, [conversationData, isGroupChat, selectedIds, onAddMembers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] w-screen md:max-w-[784px]">
        <DialogHeader>
          <DialogTitle>Thành viên</DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập danh sách thành viên ở đây. Nhấp vào lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <SelectFriends
          open={open}
          params={{ conversationId: conversationData.id }}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button size="sm" disabled={disabled} onClick={handleAdd}>
            Mời vào nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddMembers;
