"use client";

import { Group } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";

import { IDispatchState } from "@/types";
import { useToggle } from "@/hooks/useToggle";
import ModalInfoDetails from "@/components/pages/groups/[groupId]/modal-info-details";

export type IGroupWithCountMember = Group & {
  _count: { groupMembers: number };
};

interface Props {
  children: React.ReactNode;
  data: {
    isMember: boolean;
    isFollowing: boolean;
    isRequested: boolean;
    group: IGroupWithCountMember;
  };
}

export type GroupContext = {
  isMember: boolean;
  isFollowing: boolean;
  isGroupOwner: boolean;
  isRequested: boolean;
  pathname?: string | null;
  groupData: IGroupWithCountMember;
  tabs: { url: string; label: string }[];
  modalEdit: boolean;
  toggleModalEdit: (val?: boolean) => void;
  // Actions
  setGroupData: IDispatchState;
  setIsMember: IDispatchState;
  setIsFollowing: IDispatchState;
  setIsRequested: IDispatchState;
};

const tabs = [
  { url: "/", label: "Thảo luận" },
  { url: "/members", label: "Thành viên" },
  { url: "/media", label: "File phương tiện" },
];

const GroupContext = createContext<GroupContext>({
  tabs,
  isMember: false,
  isFollowing: false,
  isGroupOwner: false,
  isRequested: false,
  groupData: {} as IGroupWithCountMember,
  modalEdit: false,
  toggleModalEdit: () => {},
  setGroupData: () => {},
  setIsMember: () => {},
  setIsFollowing: () => {},
  setIsRequested: () => {},
});

export const GroupProvider = ({ children, data }: Props) => {
  const pathname = usePathname();

  const { userId } = useAuth();

  const [modalEdit, toggleModalEdit] = useToggle(false);
  const [isMember, setIsMember] = useState(data.isMember);
  const [isFollowing, setIsFollowing] = useState(data.isFollowing);
  const [isRequested, setIsRequested] = useState(data.isRequested);
  const [groupData, setGroupData] = useState<IGroupWithCountMember>(data.group);

  const isGroupOwner = useMemo(
    () => userId === groupData.owner_id,
    [userId, groupData]
  );

  return (
    <GroupContext.Provider
      value={{
        tabs,
        isFollowing,
        isGroupOwner,
        isRequested,
        isMember,
        pathname,
        groupData,
        modalEdit,
        setIsMember,
        setIsFollowing,
        setIsRequested,
        setGroupData,
        toggleModalEdit,
      }}
    >
      {children}
      <ModalInfoDetails open={modalEdit} onOpenChange={toggleModalEdit} />
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  return useContext(GroupContext);
};
