import {
  X,
  UserX,
  Pencil,
  Trash2,
  BellOff,
  Ellipsis,
  ShieldAlert,
  MessageSquareWarning,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { Group, Post, User } from "@prisma/client";

import { cn, getRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import DropdownActions from "./dropdown-actions";
import Link from "next/link";

interface Props {
  data: Post & { user: User; group: Group | null };
}

const PostHeader = ({ data }: Props) => {
  const { userId } = useAuth();
  const { id, user, group, group_id, created_at } = data;

  const isOwner = useMemo(() => userId === user.id, [user, userId]);

  const href = useMemo(() => {
    if (!group_id || !group) return `/account/${user.id}`;
    return `/group/${group.id}`;
  }, [user, group, group_id]);

  const avatar = useMemo(() => {
    if (group_id && group) return group.cover;
    return user.avatar;
  }, [group_id, group, user]);

  const name = useMemo(() => {
    if (!group_id || !group) return user.full_name;
    return group.group_name;
  }, [group_id, group, user]);

  const actions = useMemo(() => {
    const groupActions = [];
    if (group_id && group) {
      groupActions.push({
        label: `Bỏ theo dõi nhóm ${group.group_name}`,
        icon: <BellOff className="mr-2" size={20} />,
      });
      if (!isOwner) {
        groupActions.push({
          label: "Báo cáo bài viết với quản trị viên nhóm",
          icon: <ShieldAlert className="mr-2" size={20} />,
        });
      }
    }

    const userActions = [];
    if (isOwner) {
      userActions.push(
        {
          label: "Chỉnh sửa bài viết",
          icon: <Pencil className="mr-2" size={20} />,
        },
        {
          label: "Xóa bài viết",
          icon: <Trash2 className="mr-2" size={20} />,
          destructive: true,
        }
      );
    } else {
      userActions.push(
        {
          label: "Báo cáo bài viết",
          icon: <MessageSquareWarning className="mr-2" size={20} />,
        },
        {
          label: `Chặn trang cá nhân của ${user.full_name}}`,
          icon: <UserX className="mr-2" size={20} />,
        }
      );
    }

    return [...groupActions, ...userActions];
  }, [group_id, group, user, isOwner]);

  return (
    <div className="flex w-full items-center px-4 pt-3 mb-3">
      {/* Image */}
      <div className="relative flex justify-center items-center">
        <Link
          className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden"
          href={href}
        >
          <AvatarImg
            className="absolute w-full h-full"
            src={avatar}
            alt={`post-avatar-${id}`}
          />
        </Link>
        {group_id && (
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
          group_id ? "mx-5" : "ml-2 mr-5"
        )}
      >
        <div className="flex-1 text-sm line-clamp-1">
          <Link className="font-semibold w-fit" href={href}>
            {name}
          </Link>
        </div>
        <div className="flex items-center flex-1 text-xs">
          {group && (
            <>
              <Link className="" href={`/account/${user.id}`}>
                {user.full_name}
              </Link>
              <div className="mx-2">•</div>
            </>
          )}
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
        {isOwner && (
          <Button
            className="rounded-full hover:bg-primary/50"
            variant="outline"
            size="icon"
          >
            <X size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
