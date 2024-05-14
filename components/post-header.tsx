import Image from "next/image";
import { useMemo } from "react";
import { Ellipsis, X } from "lucide-react";
import { Group, Post, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import { cn } from "@/lib/utils";

interface Props {
  data: Post & { user: User; group: Group | null };
}

const PostHeader = ({ data }: Props) => {
  const { id, user, group, group_id } = data;
  const avatar = useMemo(() => {
    if (group_id && group) return group.cover;
    return user.avatar;
  }, [data]);
  return (
    <div className="flex w-full items-center px-4 pt-3 mb-3">
      {/* Image */}
      <div className="relative flex justify-center items-center">
        <div className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden">
          <AvatarImg
            className="absolute w-full h-full"
            src={avatar}
            alt={`post-avatar-${id}`}
          />
        </div>
        {group_id && (
          <div className="absolute -bottom-1 -right-2 flex justify-center items-center">
            <div className="relative w-7 h-7 flex justify-center items-center rounded-full overflow-hidden border-slate-800 border border-solid shadow-lg">
              <AvatarImg
                className="absolute w-full h-full"
                src={user.avatar}
                alt={user.full_name}
                fallback={user.first_name?.[0]}
              />
            </div>
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
        <div className="flex-1 text-sm">
          <div className="font-semibold">Tuyển dụng thực tập IT</div>
        </div>
        <div className="flex items-center flex-1 text-xs">
          <div className="">Người tham gia ẩn danh</div>
          <div className="mx-2">•</div>
          <div className="">8 giờ</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-x-1">
        <Button
          className="rounded-full hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          <Ellipsis size={20} />
        </Button>
        <Button
          className="rounded-full hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
};

export default PostHeader;
