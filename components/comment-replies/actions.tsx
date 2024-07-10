"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { Ellipsis, MessageSquareWarning, ShieldAlert } from "lucide-react";
import { User, Post, Group, CommentReply, File as IFile } from "@prisma/client";

import { ReportToEnum } from "@/lib/enum";
import { useToggle } from "@/hooks/useToggle";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AlertModal from "@/components/alert-modal";
import ReportModal from "@/components/report-modal";

interface Props {
  data: CommentReply & { user: User; file?: IFile | null };
  dataPost: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
  };
  toggleIsEdit?: (val?: boolean) => void;
  onDelete?: () => void;
}

const Actions = ({ data, dataPost, toggleIsEdit, onDelete }: Props) => {
  const { userId } = useAuth();
  const { user } = data;
  const { group } = dataPost;

  const [confirmModal, toggleConfirmModal] = useToggle(false);
  const [modalReport, toggleModalReport] = useToggle(false);
  const [typeReport, setTypeReport] = useState(ReportToEnum.admin);

  const isOwner = userId === user.id;

  const actions = useMemo(() => {
    const result: IDropdownAction[] = [];

    if (isOwner) {
      result.push(
        { label: "Chỉnh sửa", onClick: () => toggleIsEdit?.(true) },
        {
          label: "Xóa",
          destructive: true,
          onClick: () => toggleConfirmModal(true),
        }
      );
    } else {
      result.push({
        label: "Báo cáo bình luận",
        icon: <MessageSquareWarning className="mr-2" size={20} />,
        onClick: () => {
          toggleModalReport(true);
          setTypeReport(ReportToEnum.admin);
        },
      });
    }

    if (group && !isOwner) {
      result.push({
        label: "Báo cáo bình luận với quản trị viên",
        icon: <ShieldAlert className="mr-2" size={20} />,
        onClick: () => {
          toggleModalReport(true);
          setTypeReport(ReportToEnum.group);
        },
      });
    }

    return result;
  }, [user, dataPost, group, isOwner]);

  return (
    <>
      <AlertModal
        destructive
        open={confirmModal}
        onOpenChange={toggleConfirmModal}
        onClick={onDelete}
      />
      <DropdownActions
        size="icon"
        actions={actions}
        icon={<Ellipsis size={20} />}
      />
      <ReportModal
        data={{
          report_to: typeReport,
          group_id: dataPost.group_id,
          post_id: dataPost.id,
          comment_id: data.comment_id,
          reply_id: data.id,
        }}
        open={modalReport}
        onOpenChange={toggleModalReport}
      />
    </>
  );
};

export default Actions;
