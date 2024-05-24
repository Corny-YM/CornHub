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
import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { Group, Post, User } from "@prisma/client";

import { cn, getRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import DropdownActions from "@/components/dropdown-actions";

interface Props {
  isGroupOwner?: boolean;
  isGroupOwnerPost?: boolean;
  data: Post & { user: User; group: Group | null };
}

// TODO: isPostOwner & isGroupOwnerPost
const PostHeader = ({ data, isGroupOwner, isGroupOwnerPost }: Props) => {
  const { userId } = useAuth();
  const { id, user, group, group_id, created_at } = data;

  const isPostOwner = useMemo(() => userId === user.id, [user, userId]);

  const href = useMemo(() => {
    if (!group_id || !group) return `/account/${user.id}`;
    return `/group/${group.id}`;
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
    const groupActions = [];
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

    const userActions = [];
    if (isPostOwner) {
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
  }, [group_id, group, user, isPostOwner, isGroupOwner]);

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
        {(isGroupOwnerPost || isPostOwner) && (
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
