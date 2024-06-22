"use client";

import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

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
import SelectFriends from "./select-friends";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/actions/conversation";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalMembers = ({ open, onOpenChange }: Props) => {
  const { conversationData, isGroupChat } = useConversationContext();

  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const { data, isLoading } = useQuery({
    enabled:
      !!conversationData && isGroupChat && !Object.keys(selectedIds).length,
    queryKey: ["conversation", "members", conversationData.id],
    queryFn: () => getMembers(conversationData.id),
  });

  useEffect(() => {
    if (!data) return;
    const result = data.reduce((obj, item) => {
      return { ...obj, [item.member_id]: item.member };
    }, {});
    setSelectedIds(result);
  }, [data]);

  const handleAdd = useCallback(() => {}, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] w-screen md:max-w-[784px]">
        <DialogHeader>
          <DialogTitle>Thành viên</DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập danh sách thành viên ở đây. Nhấp vào lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <SelectFriends
          open={open}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button size="sm" disabled={false} onClick={handleAdd}>
            Mời vào nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMembers;
