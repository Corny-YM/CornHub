"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  pathname?: string | null;
};

const GroupsContext = createContext<Context>({});

export const GroupsProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <GroupsContext.Provider value={{ pathname: pathname }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroupsContext = () => {
  return useContext(GroupsContext);
};
