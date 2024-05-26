"use client";

import { Group } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";

import { IDispatchState } from "@/types";

export type IGroupWithCountMember = Group & {
  _count: { groupMembers: number };
};

interface Props {
  children: React.ReactNode;
  data: {
    isMember: boolean;
    isFollowing: boolean;
    group: IGroupWithCountMember;
  };
}

type Context = {
  isMember: boolean;
  isFollowing: boolean;
  isGroupOwner: boolean;
  pathname?: string | null;
  groupData: IGroupWithCountMember;
  tabs: { url: string; label: string }[];
  // Actions
  setGroupData: IDispatchState;
  setIsMember: IDispatchState;
  setIsFollowing: IDispatchState;
};

const tabs = [
  { url: "/", label: "Thảo luận" },
  { url: "/members", label: "Thành viên" },
  { url: "/media", label: "File phương tiện" },
];

const GroupContext = createContext<Context>({
  tabs,
  isMember: false,
  isFollowing: false,
  isGroupOwner: false,
  groupData: {} as IGroupWithCountMember,
  setGroupData: () => {},
  setIsMember: () => {},
  setIsFollowing: () => {},
});

export const GroupProvider = ({ children, data }: Props) => {
  const pathname = usePathname();

  const { userId } = useAuth();

  const [isMember, setIsMember] = useState(data.isMember);
  const [isFollowing, setIsFollowing] = useState(data.isFollowing);
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
        isMember,
        pathname,
        groupData,
        setGroupData,
        setIsMember,
        setIsFollowing,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  return useContext(GroupContext);
};
