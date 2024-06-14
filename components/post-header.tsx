import {
  UserX,
  Pencil,
  Trash2,
  BellOff,
  Ellipsis,
  ShieldAlert,
  MessageSquareWarning,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Group, Post, User, File as IFile } from "@prisma/client";

import { destroy } from "@/actions/post";
import { useToggle } from "@/hooks/useToggle";
import { cn, getRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AvatarImg from "@/components/avatar-img";
import AlertModal from "@/components/alert-modal";
import PostingModal from "@/components/posting-modal";

interface Props {
  isModal?: boolean;
  isGroupOwner?: boolean;
  isGroupOwnerPost?: boolean;
  data: Post & { user: User; group: Group | null; file: IFile | null };
  onSuccessDelete?: () => void;
  onSuccessUpdate?: (
    res: Post & { user: User; group: Group | null; file: IFile | null }
  ) => void;
}

const PostHeader = ({
  data,
  isModal,
  isGroupOwner,
  isGroupOwnerPost,
  onSuccessDelete,
  onSuccessUpdate,
}: Props) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { id, user, group, group_id, created_at } = data;

  const [confirmDelete, toggleConfirmDelete] = useToggle(false);
  const [modalUpdate, toggleModalUpdate] = useToggle(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["post", "destroy", data.id],
    mutationFn: destroy,
    onSuccess() {
      toast.success("Xóa post thành công");
      router.refresh();
      onSuccessDelete?.();
    },
    onError() {
      toast.error("Xóa post thất bại. Vui lòng thử lại sau");
    },
  });

  const isPostOwner = useMemo(() => userId === user.id, [user, userId]);

  const href = useMemo(() => {
    if (!group_id || !group) return `/account/${user.id}`;
    return `/groups/${group.id}`;
  }, [user, group, group_id]);

  const avatar = useMemo(() => {
    if (group_id && group && !isGroupOwnerPost) return group.cover;
    return user.avatar;
  }, [group_id, group, user, isGroupOwnerPost]);

  const name = useMemo(() => {
    if (group_id && group && !isGroupOwnerPost) return group.group_name;
    return user.full_name;
  }, [group_id, group, user, isGroupOwnerPost]);

  const actions = useMemo(() => {
    const groupActions: IDropdownAction[] = [];
    if (group_id && group) {
      if (!isGroupOwner) {
        groupActions.push({
          label: `Bỏ theo dõi nhóm ${group.group_name}`,
          icon: <BellOff className="mr-2" size={20} />,
        });
      }
      if (!isPostOwner) {
        groupActions.push({
          label: "Báo cáo bài viết với quản trị viên nhóm",
          icon: <ShieldAlert className="mr-2" size={20} />,
        });
      }
    }

    const userActions: IDropdownAction[] = [];
    if (isPostOwner) {
      userActions.push(
        {
          label: "Chỉnh sửa bài viết",
          icon: <Pencil className="mr-2" size={20} />,
          onClick: () => toggleModalUpdate(true),
        },
        {
          label: "Xóa bài viết",
          icon: <Trash2 className="mr-2" size={20} />,
          destructive: true,
          disabled: isPending,
          onClick: () => toggleConfirmDelete(true),
        }
      );
    } else {
      userActions.push(
        {
          label: "Báo cáo bài viết",
          icon: <MessageSquareWarning className="mr-2" size={20} />,
        },
        {
          label: `Chặn trang cá nhân của ${user.full_name}`,
          icon: <UserX className="mr-2" size={20} />,
          destructive: true,
        }
      );
    }

    return [...groupActions, ...userActions] as IDropdownAction[];
  }, [group_id, group, user, isPostOwner, isGroupOwner, isPending]);

  const handleDeletePost = useCallback(() => {
    if (!data) return;
    mutate(data.id);
  }, [data]);

  return (
    <div
      className={cn(
        "flex w-full items-center px-4 pt-3 mb-3",
        isModal && "px-0"
      )}
    >
      {/* Image */}
      <div className="relative flex justify-center items-center">
        <Link
          className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden"
          href={href}
        >
          <AvatarImg
            className="absolute w-full h-full"
            isGroup
            src={avatar}
            alt={`post-avatar-${id}`}
          />
        </Link>
        {group_id && !isGroupOwnerPost && (
          <div className="absolute -bottom-1 -right-2 flex justify-center items-center">
            <Link
              className="relative w-7 h-7 flex justify-center items-center rounded-full overflow-hidden border-slate-800 border border-solid shadow-lg"
              href={`/account/${user.id}`}
            >
              <AvatarImg
                className="absolute w-full h-full"
                src={user.avatar}
                alt={user.full_name}
                fallback={user.first_name?.[0]}
              />
            </Link>
          </div>
        )}
      </div>

      {/* Identify */}
      <div
        className={cn(
          "flex flex-col flex-1 justify-center",
          group_id && !isGroupOwnerPost ? "mx-5" : "ml-2 mr-5"
        )}
      >
        <div className="flex-1 text-sm line-clamp-1">
          <Link className="font-semibold w-fit" href={href}>
            {name}
          </Link>
        </div>
        <div className="flex items-center flex-1 text-xs">
          {group_id && !isGroupOwnerPost ? (
            <>
              <Link className="" href={`/account/${user.id}`}>
                {user.full_name}
              </Link>
              <div className="mx-2">•</div>
            </>
          ) : isGroupOwnerPost ? (
            <Badge className="mr-2 px-1 text-[10px]">Admin</Badge>
          ) : null}
          <div className="">{getRelativeTime(created_at)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-x-1">
        <DropdownActions
          className="hover:bg-primary/50"
          actions={actions}
          icon={<Ellipsis size={20} />}
        />
      </div>

      <AlertModal
        destructive
        open={confirmDelete}
        onOpenChange={toggleConfirmDelete}
        onClick={handleDeletePost}
      />

      <PostingModal
        groupId={group_id}
        open={modalUpdate}
        data={data}
        toggleOpen={toggleModalUpdate}
        onSuccess={onSuccessUpdate}
      />
    </div>
  );
};

export default PostHeader;
