"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Pencil, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getMembers } from "@/actions/group";
import { useToggle } from "@/hooks/useToggle";
import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ModalInvite from "@/components/pages/groups/[groupId]/modal-invite";
import NoAvatar from "@/public/no-avatar.jpg";

const Info = () => {
  const { groupData, isGroupOwner } = useGroupContext();

  const [open, toggleOpen] = useToggle(false);

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
        />
      </div>
    ));
  }, [data, isLoading]);

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
        <ModalInvite open={open} onOpenChange={toggleOpen}>
          <Button onClick={() => toggleOpen(true)}>
            <Plus className="mr-2" size={20} />
            Mời
          </Button>
        </ModalInvite>
        {isGroupOwner && (
          <Button variant="outline">
            <Pencil className="mr-2" size={20} />
            Chỉnh sửa nhóm
          </Button>
        )}
      </div>
    </div>
  );
};

export default Info;
