"use client";

import { useAuth } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useContext, createContext, useMemo } from "react";

interface Props {
  children: React.ReactNode;
  accountData: User;
}

type Context = {
  tabs: Array<{ url: string; label: string }>;
  pathname?: string;
  accountData: User;
  isOwner: boolean;
};

const tabs = [
  { url: "/", label: "Bài viết" },
  { url: "/about", label: "Giới thiệu" },
  { url: "/friends", label: "Bạn bè" },
  { url: "/images", label: "Ảnh" },
  { url: "/videos", label: "Video" },
];

const AccountContext = createContext<Context>({
  tabs,
  isOwner: false,
  accountData: {} as User,
});

export const AccountProvider = ({ children, accountData }: Props) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isOwner = useMemo(() => {
    return userId === accountData.id;
  }, [accountData]);

  return (
    <AccountContext.Provider value={{ tabs, pathname, accountData, isOwner }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
