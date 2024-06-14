"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Bell, BellOff, DoorOpen, Ellipsis } from "lucide-react";

import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/group/useMutates";
import { useGroupContext } from "@/providers/group-provider";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AlertModal from "@/components/alert-modal";
import NoAvatar from "@/public/no-avatar.jpg";

interface Props {
  groupId: number;
  data: User;
}

const CardMember = ({ groupId, data }: Props) => {
  const router = useRouter();
  const { userId } = useAuth();

  const [modalConfirm, toggleModalConfirm] = useToggle(false);

  const { isFollowing, setIsFollowing, isMember, setIsMember, isGroupOwner } =
    useGroupContext();

  const {
    isPendingLeave,
    isPendingUnfollow,
    isPendingFollowing,
    onLeave,
    onUnfollow,
    onFollowing,
  } = useMutates({ groupId: groupId, userId: userId });

  const isOwner = userId === data.id;

  const actions = useMemo(() => {
    const arr: IDropdownAction[] = [];

    if (!isGroupOwner)
      arr.push(
        isFollowing
          ? {
              label: "Bỏ theo dõi",
              icon: <BellOff className="mr-2" size={20} />,
              disabled: isPendingUnfollow,
              onClick: async () =>
                await onUnfollow(() => setIsFollowing(false)),
            }
          : {
              label: "Theo dõi",
              icon: <Bell className="mr-2" size={20} />,
              disabled: isPendingFollowing,
              onClick: async () =>
                await onFollowing(() => setIsFollowing(true)),
            }
      );

    if (isMember) {
      arr.push({
        label: "Rời nhóm",
        icon: <DoorOpen className="mr-2" size={20} />,
        destructive: true,
        onClick: () => toggleModalConfirm(true),
      });
    }
    return arr;
  }, [
    isOwner,
    isMember,
    isFollowing,
    isGroupOwner,
    isPendingUnfollow,
    isPendingFollowing,
    onUnfollow,
    onFollowing,
  ]);

  const handleLeave = useCallback(async () => {
    await onLeave(() => {
      setIsMember(false);
      router.refresh();
      router.push(`/groups/${groupId}`);
    });
  }, [groupId, onLeave]);

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
      <Link className="flex-1 px-3 line-clamp-2" href={`/account/${data.id}`}>
        {data.full_name}
      </Link>
      {(isGroupOwner || isOwner) && (
        <div className="flex justify-center items-center h-full">
          <DropdownActions
            className="hover:bg-primary/50"
            actions={actions}
            icon={<Ellipsis />}
          />
        </div>
      )}

      <AlertModal
        destructive
        open={modalConfirm}
        disabled={isPendingLeave}
        onOpenChange={toggleModalConfirm}
        onClick={handleLeave}
      />
    </div>
  );
};

export default CardMember;
