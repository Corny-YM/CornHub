"use client";

import Image from "next/image";
import {
  Bell,
  BellOff,
  CheckCircle,
  CircleCheckBig,
  DoorOpen,
  Pencil,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMembers } from "@/actions/group";
import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/group/useMutates";
import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AlertModal from "@/components/alert-modal";
import DropdownActions from "@/components/dropdown-actions";
import ModalInvite from "@/components/pages/groups/[groupId]/modal-invite";
import NoAvatar from "@/public/no-avatar.jpg";

const Info = () => {
  const { userId } = useAuth();
  const {
    groupData,
    modalEdit,
    isMember,
    isRequested,
    isFollowing,
    isGroupOwner,
    setIsMember,
    setIsRequested,
    setIsFollowing,
    toggleModalEdit,
  } = useGroupContext();

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
  } = useMutates({ groupId: groupData.id, userId });

  const [openModalInvite, toggleOpenModalInvite] = useToggle(false);
  const [openModalLeaveGroup, toggleOpenModalLeaveGroup] = useToggle(false);

  const { data, isLoading } = useQuery({
    queryKey: ["group", "members", groupData.id],
    queryFn: () => getMembers(groupData.id, { limit: 10 }),
  });

  const content = useMemo(() => {
    if (isLoading) return <Skeleton className="friends-icon" />;
    if (!data || !data.length) return null;
    return data.map((item, index) => (
      <div
        key={item.id}
        className="friends-icon"
        style={{ zIndex: length - index }}
      >
        <Image
          className="w-full h-full"
          src={item.avatar || NoAvatar}
          alt={item.full_name || "member-avatar"}
          fill
          sizes="w-8"
        />
      </div>
    ));
  }, [data, isLoading]);

  const handleJoinGroup = useCallback(async () => {
    await onJoin(() => {
      setIsMember(true);
      setIsRequested(false);
    });
  }, [onJoin]);

  const handleFollowingGroup = useCallback(async () => {
    await onFollowing(() => setIsFollowing(true));
  }, [onFollowing]);

  const handleUnfollowGroup = useCallback(async () => {
    await onUnfollow(() => setIsFollowing(false));
  }, [onUnfollow]);

  const handleLeaveGroup = useCallback(async () => {
    await onLeave(() => setIsMember(false));
  }, [onLeave]);

  const handleDeniedGroupRequest = useCallback(async () => {
    await onDeniedRequest(() => setIsRequested(false));
  }, [onDeniedRequest]);

  return (
    <div className="w-full relative flex items-center px-4">
      <div className="flex-1 h-full flex flex-col justify-center pt-6 pb-4">
        <div className="text-2xl font-semibold">{groupData.group_name}</div>
        <div>
          <a className="hover:underline w-fit" href="/">
            {groupData._count.groupMembers || 0} thành viên
          </a>
        </div>
        <div className="w-full flex items-center">{content}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isMember && (
          <ModalInvite
            open={openModalInvite}
            onOpenChange={toggleOpenModalInvite}
          >
            <Button onClick={() => toggleOpenModalInvite(true)}>
              <Plus className="mr-2" size={20} />
              Mời
            </Button>
          </ModalInvite>
        )}
        {isMember && !isGroupOwner && (
          <DropdownActions
            size="default"
            icon={
              <div className="flex items-center justify-center">
                <CircleCheckBig size={20} className="mr-2" /> Đã tham gia
              </div>
            }
            actions={[
              isFollowing
                ? {
                    label: "Bỏ theo dõi nhóm",
                    disabled: isPendingUnfollow,
                    icon: <BellOff className="mr-2" size={20} />,
                    onClick: handleUnfollowGroup,
                  }
                : {
                    label: "Theo dõi nhóm",
                    disabled: isPendingFollowing,
                    icon: <Bell className="mr-2" size={20} />,
                    onClick: handleFollowingGroup,
                  },
              {
                label: "Rời nhóm",
                destructive: true,
                icon: <DoorOpen className="mr-2" size={20} />,
                onClick: () => toggleOpenModalLeaveGroup(true),
              },
            ]}
          />
        )}
        {!isMember && !isRequested && (
          <Button disabled={isPendingJoin} onClick={handleJoinGroup}>
            <UsersRound className="mr-2" size={20} />
            Tham gia
          </Button>
        )}
        {!isMember && isRequested && (
          <>
            <Button
              variant="destructive"
              disabled={isPendingDeniedRequest}
              onClick={handleDeniedGroupRequest}
            >
              <X className="mr-2" size={20} />
              Hủy bỏ
            </Button>
            <Button disabled={isPendingJoin} onClick={handleJoinGroup}>
              <CheckCircle className="mr-2" size={20} />
              Chấp nhận
            </Button>
          </>
        )}
        {isGroupOwner && (
          <Button variant="outline" onClick={() => toggleModalEdit(true)}>
            <Pencil className="mr-2" size={20} />
            Chỉnh sửa nhóm
          </Button>
        )}
      </div>

      {/* Modals */}
      <AlertModal
        destructive
        disabled={isPendingLeave}
        open={openModalLeaveGroup}
        onOpenChange={toggleOpenModalLeaveGroup}
        onClick={handleLeaveGroup}
      />
    </div>
  );
};

export default Info;
