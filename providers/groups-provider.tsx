"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  pathname?: string | null;
};

const GroupContext = createContext<Context>({});

export const GroupProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <GroupContext.Provider value={{ pathname: pathname }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  return useContext(GroupContext);
};
