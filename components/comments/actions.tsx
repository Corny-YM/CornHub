"use client";

import { Ellipsis } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { Comment, User, File as IFile, Post, Group } from "@prisma/client";

import { TypeReportEnum } from "@/lib/enum";
import { useToggle } from "@/hooks/useToggle";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AlertModal from "@/components/alert-modal";
import ReportModal from "@/components/report-modal";

interface Props {
  data: Comment & { user: User; file?: IFile | null };
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
  const [typeReport, setTypeReport] = useState(TypeReportEnum.admin);

  const isOwner = userId === user.id;

  const actions = useMemo(() => {
    const result: IDropdownAction[] = [];

    const isGroupOwnerComment = dataPost.user_id === group?.owner_id;

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
        onClick: () => {
          toggleModalReport(true);
          setTypeReport(TypeReportEnum.admin);
        },
      });
    }

    if (group && !isOwner && !isGroupOwnerComment) {
      result.push({
        label: "Báo cáo bình luận với quản trị viên",
        onClick: () => {
          toggleModalReport(true);
          setTypeReport(TypeReportEnum.group);
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
          comment_id: data.id,
        }}
        open={modalReport}
        onOpenChange={toggleModalReport}
      />
    </>
  );
};

export default Actions;
