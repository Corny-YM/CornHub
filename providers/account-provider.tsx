"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useContext, createContext } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  tabs: Array<{ url: string; label: string }>;
  pathname?: string;
};

const tabs = [
  { url: "/", label: "Bài viết" },
  { url: "/about", label: "Giới thiệu" },
  { url: "/friends", label: "Bạn bè" },
  { url: "/images", label: "Ảnh" },
  { url: "/videos", label: "Video" },
];

const AccountContext = createContext<Context>({ tabs });

export const AccountProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <AccountContext.Provider value={{ tabs, pathname }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
