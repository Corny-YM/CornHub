"use client";

import { Ellipsis } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { Comment, User, File as IFile, Post, Group } from "@prisma/client";

import { useToggle } from "@/hooks/useToggle";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AlertModal from "@/components/alert-modal";

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
        onClick: () => {},
      });
    }

    if (group && !isOwner && !isGroupOwnerComment) {
      result.push({
        label: "Báo cáo bình luận với quản trị viên",
        onClick: () => {},
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
    </>
  );
};

export default Actions;
