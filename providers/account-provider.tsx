"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

type Context = {
  tabs: Array<{ id: string; label: string }>;
  selectedTab?: string | null;
  onSelectedTab: (id: string) => void;
};

const tabs = [
  { id: "posts", label: "Bài viết" },
  { id: "introduction", label: "Giới thiệu" },
  { id: "friends", label: "Bạn bè" },
  { id: "images", label: "Ảnh" },
  { id: "videos", label: "Video" },
];

const AccountContext = createContext<Context>({
  tabs,
  selectedTab: null,
  onSelectedTab: () => {},
});

export const AccountProvider = ({ children }: Props) => {
  const [selectedTab, setSelectedTab] = useState<string | null>("posts");

  const onSelectedTab = useCallback((id: string) => {
    const existedTab = tabs.find((item) => item.id === id);
    if (!existedTab) return;
    setSelectedTab(id);
  }, []);

  return (
    <AccountContext.Provider value={{ tabs, selectedTab, onSelectedTab }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
