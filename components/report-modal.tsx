"use client";

import toast from "react-hot-toast";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

import { store } from "@/actions/report";
import { TypeReportEnum } from "@/lib/enum";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";

interface Props {
  data: {
    report_to: TypeReportEnum;
    user_id?: string | null;
    post_id?: number | null;
    group_id?: number | null;
    comment_id?: number | null;
    reply_id?: number | null;
  };
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

const ReportModal = ({ open, data, onOpenChange }: Props) => {
  const { userId } = useAuth();
  const { report_to } = data;

  const [value, setValue] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["report", userId],
    mutationFn: store,
    onSuccess(res) {
      toast.success("Báo cáo thành công");
      onOpenChange(false);
      setValue("");
    },
    onError() {
      toast.error("Báo cáo thất bại. Vui lòng thử lại sau");
    },
  });

  const disabled = useMemo(
    () => isPending || !value.trim(),
    [isPending, value]
  );

  const title = useMemo(() => {
    if (report_to === TypeReportEnum.admin) return "Báo cáo tới Admin";
    return "Báo cáo tới quản trị viên nhóm";
  }, [report_to]);

  const handleChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setValue(value);
  }, []);

  const handleReport = useCallback(() => {
    if (!data || !userId || !value.trim()) return;
    mutate({ ...data, sender_id: userId, description: value });
  }, [data, value, userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] sm:w-[600px] sm:max-w-none flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="h-full max-h-full flex flex-col">
          <div className="flex flex-col w-full space-y-2">
            <Label htmlFor="description">Nội dung vi phạm</Label>
            <Input
              id="description"
              placeholder="Nội dung..."
              value={value}
              disabled={isPending}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={disabled}
            onClick={handleReport}
          >
            Gửi báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
