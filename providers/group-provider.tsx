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
  data: IGroupWithCountMember;
}

type Context = {
  tabs: { url: string; label: string }[];
  isOwner: boolean;
  pathname?: string | null;
  groupData: IGroupWithCountMember;
  setGroupData: IDispatchState;
};

const tabs = [
  { url: "/", label: "Thảo luận" },
  { url: "/members", label: "Thành viên" },
  { url: "/media", label: "File phương tiện" },
];

const GroupContext = createContext<Context>({
  tabs,
  isOwner: false,
  groupData: {} as IGroupWithCountMember,
  setGroupData: () => {},
});

export const GroupProvider = ({ children, data }: Props) => {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [groupData, setGroupData] = useState<IGroupWithCountMember>(data);

  const isOwner = useMemo(
    () => userId === groupData.owner_id,
    [userId, groupData]
  );

  return (
    <GroupContext.Provider
      value={{ tabs, isOwner, pathname, groupData, setGroupData }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  return useContext(GroupContext);
};
