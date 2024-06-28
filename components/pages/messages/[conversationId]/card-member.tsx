"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageReaction, User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CircleUserRound, Ellipsis, UserRoundX } from "lucide-react";

import { emotionIcons } from "@/lib/const";
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import NoAvatar from "@/public/no-avatar.jpg";

interface Props {
  data: User;
  type?: string;
  messageReaction?: MessageReaction & { user: User };
  refetch?: () => void;
}

const CardMember = ({ data, type, messageReaction, refetch }: Props) => {
  const { userId } = useAuth();
  const router = useRouter();

  const { isOwner, conversationData } = useConversationContext();

  const { onDeleteReaction, isPendingDeleteReaction } = useMutates();

  const handleRemoveReaction = useCallback(async () => {
    if (
      !messageReaction ||
      !conversationData ||
      userId !== data.id ||
      isPendingDeleteReaction
    )
      return;
    await onDeleteReaction(
      {
        reactionId: messageReaction.id,
        conversationId: conversationData.id,
        messageId: messageReaction.message_id,
      },
      () => {
        refetch?.();
      }
    );
  }, [
    data,
    userId,
    messageReaction,
    conversationData,
    isPendingDeleteReaction,
  ]);

  const handleUserProfile = useCallback(() => {
    router.push(`/account/${data.id}`);
  }, [data]);

  const Icon = useMemo(() => {
    if (!type || !messageReaction || !emotionIcons[type]) return;
    return emotionIcons[type];
  }, [type, messageReaction]);

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
      <div className="flex-1 px-3 leading-normal">
        <Link
          className="w-fit line-clamp-2 hover:underline"
          href={`/account/${data.id}`}
        >
          {data.full_name}
        </Link>
        {!!messageReaction && userId === data.id && (
          <div className="italic text-xs">Nhấn biểu tượng để gỡ</div>
        )}
      </div>
      <div className="flex justify-center items-center h-full">
        {!!Icon && (
          <div
            className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-solid cursor-pointer transition-all hover:scale-110"
            data-type={type}
            onClick={handleRemoveReaction}
          >
            <Icon />
          </div>
        )}
        {!messageReaction && (
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
