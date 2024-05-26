"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import {
  BellOff,
  CircleCheckBig,
  DoorOpen,
  Pencil,
  Plus,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getMembers,
  userJoinGroup,
  userLeaveGroup,
  userUnfollowGroup,
} from "@/actions/group";
import { useToggle } from "@/hooks/useToggle";
import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AlertModal from "@/components/alert-modal";
import DropdownActions from "@/components/dropdown-actions";
import ModalInvite from "@/components/pages/groups/[groupId]/modal-invite";
import NoAvatar from "@/public/no-avatar.jpg";

const Info = () => {
  const { userId } = useAuth();
  const { groupData, isGroupOwner, isMember, setIsFollowing, setIsMember } =
    useGroupContext();

  const [openModalInvite, toggleOpenModalInvite] = useToggle(false);
  const [openModalLeaveGroup, toggleOpenModalLeaveGroup] = useToggle(false);

  const { data, isLoading } = useQuery({
    queryKey: ["group", "members", groupData.id],
    queryFn: () => getMembers(groupData.id, { limit: 10 }),
  });

  // useMutation
  const { mutate: mutateJoinGroup, isPending: isPendingJoinGroup } =
    useMutation({
      mutationKey: ["group", "join", groupData.id, userId],
      mutationFn: userJoinGroup,
      onSuccess() {
        toast.success("Tham gia nhóm thành công");
      },
      onError() {
        toast.error("Tham gia nhóm thất bại. Vui lòng thử lại sau");
      },
    });

  const { mutate: mutateUnfollowGroup, isPending: isPendingUnfollowGroup } =
    useMutation({
      mutationKey: ["group", "unfollow", groupData.id, userId],
      mutationFn: userUnfollowGroup,
      onSuccess() {
        setIsFollowing(false);
        toast.success("Bỏ theo dõi nhóm thành công");
      },
      onError() {
        toast.error("Bỏ theo dõi nhóm thất bại. Vui lòng thử lại sau");
      },
    });

  const { mutate: mutateLeaveGroup, isPending: isPendingLeaveGroup } =
    useMutation({
      mutationKey: ["group", "leave", groupData.id, userId],
      mutationFn: userLeaveGroup,
      onSuccess() {
        setIsMember(false);
        toast.success("Rời nhóm thành công");
      },
      onError() {
        toast.error("Rời nhóm thất bại. Vui lòng thử lại sau");
      },
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
        />
      </div>
    ));
  }, [data, isLoading]);

  const handleJoinGroup = useCallback(() => {
    if (!userId || !groupData || isMember) return;
    mutateJoinGroup({ userId, groupId: groupData.id });
  }, [userId, groupData, isMember]);

  // TODO: api for unfollow & leave group
  const handleUnfollowGroup = useCallback(() => {
    if (!userId || !groupData || !isMember) return;
    mutateUnfollowGroup({ userId, groupId: groupData.id });
  }, [userId, groupData, isMember]);

  const handleLeaveGroup = useCallback(() => {
    if (!userId || !groupData || !isMember) return;
    mutateLeaveGroup({ userId, groupId: groupData.id });
  }, [userId, groupData, isMember]);

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
              {
                label: "Bỏ theo dõi nhóm",
                disabled: isPendingUnfollowGroup,
                icon: <BellOff className="mr-2" size={20} />,
                onClick: handleUnfollowGroup,
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
        {!isMember && (
          <Button disabled={isPendingJoinGroup} onClick={handleJoinGroup}>
            <UsersRound className="mr-2" size={20} />
            Tham gia
          </Button>
        )}
        {isGroupOwner && (
          <Button variant="outline">
            <Pencil className="mr-2" size={20} />
            Chỉnh sửa nhóm
          </Button>
        )}
      </div>

      {/* Modals */}
      <AlertModal
        destructive
        disabled={isPendingLeaveGroup}
        open={openModalLeaveGroup}
        onOpenChange={toggleOpenModalLeaveGroup}
        onClick={handleLeaveGroup}
      />
    </div>
  );
};

export default Info;
