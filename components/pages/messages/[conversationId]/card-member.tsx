"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CircleUserRound, Ellipsis, UserRoundX } from "lucide-react";

import { useConversationContext } from "@/providers/conversation-provider";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import NoAvatar from "@/public/no-avatar.jpg";
import { emotionIcons } from "@/lib/const";

interface Props {
  data: User;
  type?: string;
  isReaction?: boolean;
}

const CardMember = ({ data, type, isReaction }: Props) => {
  const router = useRouter();

  const { isOwner } = useConversationContext();

  const handleUserProfile = useCallback(() => {
    router.push(`/account/${data.id}`);
  }, [data]);

  const Icon = useMemo(() => {
    if (!type || !isReaction || !emotionIcons[type]) return;
    return emotionIcons[type];
  }, [type, isReaction]);

  const actions = useMemo(() => {
    const arr: IDropdownAction[] = [
      {
        label: "Xem trang cá nhân",
        icon: <CircleUserRound className="mr-2" size={20} />,
        onClick: handleUserProfile,
      },
    ];

    if (isOwner)
      arr.push({
        destructive: true,
        label: "Xóa thành viên",
        icon: <UserRoundX className="mr-2" size={20} />,
      });

    return arr;
  }, [isOwner, handleUserProfile]);

  return (
    <div className="w-full min-h-11 flex items-center p-2 rounded-lg overflow-hidden shadow-lg dark:bg-neutral-800/50 bg-[#f0f2f5]">
      <div className="relative flex justify-center items-center w-14 h-14 rounded-full overflow-hidden">
        <Image
          className="absolute w-full h-full"
          src={data.avatar || NoAvatar}
          alt={data.full_name || "member-avatar"}
          fill
          sizes="w-14"
        />
      </div>
      <Link
        className="flex-1 px-3 line-clamp-2 hover:underline"
        href={`/account/${data.id}`}
      >
        {data.full_name}
      </Link>
      <div className="flex justify-center items-center h-full">
        {!!Icon && (
          <div
            data-type={type}
            className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-solid cursor-pointer transition-all hover:scale-110"
          >
            <Icon />
          </div>
        )}
        {!isReaction && (
          <DropdownActions
            className="hover:bg-primary/50"
            actions={actions}
            icon={<Ellipsis />}
          />
        )}
      </div>
    </div>
  );
};

export default CardMember;
