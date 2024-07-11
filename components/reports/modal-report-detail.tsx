"use client";

import { Report } from "@prisma/client";
import { useCallback, useMemo } from "react";

import { TypeReportEnum } from "@/lib/enum";
import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/report/useMutates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import AlertModal from "@/components/alert-modal";
import InfoUser from "@/components/reports/info-user";
import InfoPost from "@/components/reports/info-post";
import InfoGroup from "@/components/reports/info-group";
import InfoReply from "@/components/reports/info-reply";
import InfoComment from "@/components/reports/info-comment";

interface Props {
  data: Report;
  open: boolean;
  title?: string | null;
  type?: TypeReportEnum | null;
  onOpenChange: (val: boolean) => void;
}

const ModalReportDetail = ({
  open,
  data,
  type,
  title,
  onOpenChange,
}: Props) => {
  const { isPendingRemovePost, onRemovePost } = useMutates();

  const [modalConfirm, toggleModalConfirm] = useToggle();

  const content = useMemo(() => {
    if (type === TypeReportEnum.user)
      return <InfoUser id={data.user_id!} data={data} enabled={open} />;
    if (type === TypeReportEnum.reply)
      return <InfoReply id={data.reply_id!} data={data} enabled={open} />;
    if (type === TypeReportEnum.comment)
      return <InfoComment id={data.comment_id!} data={data} enabled={open} />;
    if (type === TypeReportEnum.post)
      return <InfoPost id={data.post_id!} data={data} enabled={open} />;
    if (type === TypeReportEnum.group)
      return <InfoGroup id={data.group_id!} data={data} enabled={open} />;
  }, [type, open]);

  const handleReport = useCallback(async () => {
    if (type === TypeReportEnum.user) {
    } else if (type === TypeReportEnum.reply) {
    } else if (type === TypeReportEnum.comment) {
    } else if (type === TypeReportEnum.post) {
      await onRemovePost(data.post_id!);
    } else if (type === TypeReportEnum.group) {
    }
    onOpenChange(false);
  }, [type]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="z-[9999]" />
        <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none flex flex-col h-[80vh] !ring-0 !ring-offset-0 !outline-none">
          <DialogHeader>
            <DialogTitle>
              Chi tiết báo cáo:{" "}
              {title && <Badge variant="destructive">{title}</Badge>}
            </DialogTitle>
          </DialogHeader>

          {/* content */}
          <div className="w-full h-full flex flex-col overflow-hidden overflow-y-auto">
            <ScrollArea className="max-h-full -mx-6 px-6">{content}</ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={() => toggleModalConfirm(true)}
            >
              Xóa {title?.toLowerCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertModal
        destructive
        open={modalConfirm}
        disabled={isPendingRemovePost}
        onOpenChange={toggleModalConfirm}
        onClick={handleReport}
      />
    </>
  );
};

export default ModalReportDetail;
