"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  pathname?: string | null;
};

const FriendContext = createContext<Context>({});

export const FriendProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <FriendContext.Provider value={{ pathname: pathname }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriendContext = () => {
  return useContext(FriendContext);
};
