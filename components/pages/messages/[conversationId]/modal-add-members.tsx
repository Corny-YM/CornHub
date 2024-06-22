"use client";

import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { addMembers } from "@/actions/conversation";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import SelectFriends from "../select-friends";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalAddMembers = ({ open, onOpenChange }: Props) => {
  const { conversationData, isGroupChat } = useConversationContext();

  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const { mutate, isPending } = useMutation({
    mutationKey: ["conversation", "add", "members", conversationData.id],
    mutationFn: addMembers,
    onSuccess() {
      toast.success("Mời người dùng thành công");
      onOpenChange(false);
      setSelectedIds({});
    },
    onError() {
      toast.error("Mời người dùng thất bại. Vui lòng thử lại sau");
    },
  });

  const disabled = useMemo(
    () => !Object.keys(selectedIds).length || isPending,
    [selectedIds, isPending]
  );

  const handleAdd = useCallback(() => {
    const ids = Object.keys(selectedIds);
    if (!conversationData || !ids.length || !isGroupChat) return;
    mutate({
      conversationId: conversationData.id,
      ids,
    });
  }, [conversationData, isGroupChat, selectedIds]);

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
