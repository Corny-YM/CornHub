"use client";

import Link from "next/link";
import {
  User,
  Post,
  Group,
  Report,
  Comment,
  CommentReply,
} from "@prisma/client";
import { useMemo } from "react";
import { CircleCheck, X } from "lucide-react";

import { TypeReportEnum } from "@/lib/enum";
import { useToggle } from "@/hooks/useToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import ModalReportDetail from "@/components/reports/modal-report-detail";

interface Props {
  data: Report & {
    sender: User;
    user?: User | null;
    group?: Group | null;
    post?: Post | null;
    comment?: Comment | null;
    reply?: CommentReply | null;
  };
}

const CardReport = ({ data }: Props) => {
  const {
    sender,
    user_id,
    group_id,
    post_id,
    comment_id,
    reply_id,
    description,
    status,
  } = data;

  const [modalDetail, toggleModalDetail] = useToggle();

  const reportType = useMemo(() => {
    if (user_id) return TypeReportEnum.user;
    if (reply_id) return TypeReportEnum.reply;
    if (comment_id) return TypeReportEnum.comment;
    if (post_id) return TypeReportEnum.post;
    if (group_id) return TypeReportEnum.group;
  }, [reply_id, comment_id, group_id, post_id, user_id]);

  const reportTypeTitle = useMemo(() => {
    if (user_id) return group_id ? "Thành viên" : "Người dùng";
    if (reply_id) return "Phản hồi bình luận";
    if (comment_id) return "Bình luận";
    if (post_id) return "Bài viết";
    if (group_id) return "Nhóm";
  }, [reply_id, comment_id, group_id, post_id, user_id]);

  return (
    <div className="relative w-full h-fit flex flex-col px-4 py-3 rounded-lg overflow-hidden bg-zinc-200/50 dark:bg-primary-foreground/50">
      {/* Status */}
      <div className="absolute left-2 top-2">
        {!!status && (
          <div className="">
            <CircleCheck className="text-green-400" size={20} />
          </div>
        )}
      </div>

      {/* Icon remove report */}
      <div className="absolute top-1 right-1">
        <Button
          className="rounded-full p-2 h-fit w-fit hover:bg-destructive"
          variant="outline"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Info */}
      <div className="w-full h-fit flex flex-col items-center space-y-2">
        <div className="flex items-center">
          <AvatarImg src={sender.avatar} className="mr-3" />
          <Badge className="text-xs h-fit p-1">
            <Link href={`/account/${sender.id}`} target="_blank">
              {sender.full_name}
            </Link>
          </Badge>
        </div>
        <div className="leading-normal font-semibold">"{description}"</div>
      </div>

      {/* Type report */}
      <div className="w-full flex justify-between items-center mt-2">
        <div className="w-full flex items-center space-x-2">
          <div className="">Báo cáo:</div>
          <Badge className="h-fit" variant="destructive">
            {reportTypeTitle}
          </Badge>
        </div>
        <Button
          className="h-fit rounded-full px-2 py-1 hover:bg-primary-foreground/80 dark:hover:bg-primary/50 hover:text-white"
          variant="outline"
          onClick={() => toggleModalDetail(true)}
        >
          Chi tiết
        </Button>
      </div>

      <ModalReportDetail
        data={data}
        type={reportType}
        title={reportTypeTitle}
        open={modalDetail}
        onOpenChange={toggleModalDetail}
      />
    </div>
  );
};

export default CardReport;
