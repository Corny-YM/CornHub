"use client";

import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useState } from "react";

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
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalAddConversation = ({ open, onOpenChange }: Props) => {
  const { userId } = useAuth();

  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const { isPendingStoreConversation, onStoreConversation } = useMutates();

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (!value) return;
    setName(value);
  }, []);

  const handleSendGroupRequest = useCallback(async () => {
    if (!userId || !name.trim()) return;
    const ids = Object.keys(selectedIds);
    await onStoreConversation({ name, ids }, () => {
      setSelectedIds({});
      onOpenChange(false);
    });
  }, [userId, name, selectedIds, onStoreConversation]);

  const handleCancel = useCallback(() => {
    setSelectedIds({});
    onOpenChange(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] w-screen md:max-w-[784px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc hội thoại mới</DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập danh sách cuộc hội thoại và thành viên ở đây. Nhấp vào lưu
            khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="w-full h-full flex flex-col space-y-4">
          {/* Setting Chat */}
          <div className="w-full items-center">
            <Label htmlFor="name">Tên cuộc hội thoại</Label>
            <Input
              id="name"
              value={name}
              autoComplete="false"
              onChange={handleChange}
            />
          </div>

          {/* Invite Friends */}
          <SelectFriends
            open={open}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button
            size="sm"
            disabled={isPendingStoreConversation || !name.trim()}
            onClick={handleSendGroupRequest}
          >
            Tạo cuộc hội thoại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddConversation;
