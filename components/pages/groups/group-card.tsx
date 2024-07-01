"use client";

import Link from "next/link";
import Image from "next/image";
import { Group } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import { CheckCircle, DoorOpen, Ellipsis, Eye, EyeOff, X } from "lucide-react";

import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/group/useMutates";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alert-modal";
import NoCover from "@/public/no-background.jpg";

interface Props {
  data: Group;
  member?: boolean;
  request?: boolean;
  following?: boolean;
}

const GroupCard = ({ data, member, request, following }: Props) => {
  const { userId } = useAuth();

  const [open, toggleOpen] = useToggle(false);
  const [isMember, setIsMember] = useState(member);
  const [isRequested, setIsRequested] = useState(request);
  const [isFollowing, setIsFollowing] = useState(following);

  const { id, group_name, cover } = data;
  const {
    isPendingJoin,
    isPendingLeave,
    isPendingUnfollow,
    isPendingFollowing,
    isPendingDeniedRequest,
    onJoin,
    onLeave,
    onUnfollow,
    onFollowing,
    onDeniedRequest,
  } = useMutates({ groupId: id, userId });

  const handleJoinGroup = useCallback(async () => {
    await onJoin(() => {
      setIsMember(true);
      setIsRequested(false);
    });
  }, [onJoin]);

  const handleFollowingGroup = useCallback(async () => {
    await onFollowing(() => {
      setIsFollowing(true);
    });
  }, [onFollowing]);

  const handleUnfollowGroup = useCallback(async () => {
    await onUnfollow(() => {
      setIsFollowing(false);
    });
  }, [onUnfollow]);

  const handleLeaveGroup = useCallback(async () => {
    await onLeave(() => setIsMember(false));
  }, [onLeave]);

  const handleDeniedGroupRequest = useCallback(async () => {
    await onDeniedRequest(() => setIsRequested(false));
  }, [onDeniedRequest]);

  const actions: IDropdownAction[] = useMemo(() => {
    const result = [];
    const unfollow: IDropdownAction = {
      label: "Bỏ theo dõi",
      icon: <EyeOff className="mr-2" size={20} />,
      disabled: isPendingUnfollow,
      onClick: handleUnfollowGroup,
    };
    const following: IDropdownAction = {
      label: "Theo dõi",
      icon: <Eye className="mr-2" size={20} />,
      disabled: isPendingFollowing,
      onClick: handleFollowingGroup,
    };
    const leave: IDropdownAction = {
      label: "Rời nhóm",
      icon: <DoorOpen className="mr-2" size={20} />,
      destructive: true,
      disabled: isPendingLeave,
      onClick: () => toggleOpen(true),
    };
    const accept: IDropdownAction = {
      label: "Chấp nhận",
      icon: <CheckCircle className="mr-2" size={20} />,
      disabled: isPendingJoin,
      onClick: handleJoinGroup,
    };
    const denied: IDropdownAction = {
      label: "Hủy bỏ",
      icon: <X className="mr-2" size={20} />,
      destructive: true,
      disabled: isPendingDeniedRequest,
      onClick: handleDeniedGroupRequest,
    };

    if (!isRequested) result.push(isFollowing ? unfollow : following, leave);
    else result.push(accept, denied);
    return result;
  }, [
    data,
    isMember,
    isRequested,
    isFollowing,
    isPendingJoin,
    isPendingLeave,
    isPendingUnfollow,
    isPendingFollowing,
    isPendingDeniedRequest,
    toggleOpen,
    handleJoinGroup,
    handleUnfollowGroup,
    handleFollowingGroup,
    handleDeniedGroupRequest,
  ]);

  return (
    <div className="p-4 w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="w-full flex items-center justify-start">
        <div className="relative flex justify-center items-center w-20 h-20 aspect-square rounded-lg overflow-hidden">
          <Image
            className="absolute w-full h-full object-cover"
            src={cover || NoCover}
            alt="avatar_group"
            fill
            sizes="w-20"
          />
        </div>
        <div className="pl-3 flex flex-col justify-center">
          <div className="font-semibold w-full line-clamp-2">{group_name}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center w-full gap-x-2">
        <Button
          className="flex-1 hover:bg-primary/50"
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/groups/${id}`}>Xem nhóm</Link>
        </Button>
        {(isMember || isRequested) && (
          <DropdownActions
            className="hover:bg-primary/50"
            icon={<Ellipsis />}
            actions={actions}
          />
        )}
      </div>

      <AlertModal
        destructive
        open={open}
        onOpenChange={toggleOpen}
        onClick={handleLeaveGroup}
      />
    </div>
  );
};

export default GroupCard;
