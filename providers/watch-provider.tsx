"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  pathname?: string | null;
};

const WatchContext = createContext<Context>({});

export const WatchProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <WatchContext.Provider value={{ pathname: pathname }}>
      {children}
    </WatchContext.Provider>
  );
};

export const useWatchContext = () => {
  return useContext(WatchContext);
};
