"use client";

import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";

import { useMutates } from "@/hooks/mutations/message/useMutates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalAddConversation = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const { userId } = useAuth();

  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const { isPendingStoreConversation, onStoreConversation } = useMutates();

  const disabled = useMemo(
    () =>
      isPendingStoreConversation ||
      !name.trim() ||
      !Object.keys(selectedIds).length,
    [isPendingStoreConversation, name, selectedIds]
  );

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setName(value);
  }, []);

  const handleReset = useCallback(() => {
    setName("");
    setSelectedIds({});
    onOpenChange(false);
  }, []);

  const handleSendGroupRequest = useCallback(async () => {
    const ids = Object.keys(selectedIds);
    if (!userId || !name.trim() || !ids.length) return;
    await onStoreConversation({ name, ids }, (res) => {
      handleReset();
      if (res) router.push(`/messages/${res.id}`);
    });
  }, [userId, name, selectedIds, router, onStoreConversation]);

  const handleCancel = useCallback(() => {
    handleReset();
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
            disabled={disabled}
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
