"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useContext, createContext, useMemo } from "react";
import { Follower, User } from "@prisma/client";

import { getStatusFollowers } from "@/actions/user";

interface Props {
  children: React.ReactNode;
  accountData: User;
}

type Context = {
  tabs: Array<{ url: string; label: string }>;
  pathname?: string;
  accountData: User;
  isOwner: boolean;
  isLoadingStatusFollowers: boolean;
  refetchStatusFollowers: () => void;
  statusFollowers: Follower[];
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
  isLoadingStatusFollowers: false,
  refetchStatusFollowers: () => {},
  statusFollowers: [],
});

export const AccountProvider = ({ children, accountData }: Props) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isOwner = useMemo(() => {
    return userId === accountData.id;
  }, [accountData]);

  // If is owner account page =>
  // 1. take all User follow the CurrentUser
  // 2. take all User that the CurrentUser following
  const {
    data: statusFollowers,
    isLoading: isLoadingStatusFollowers,
    refetch: refetchStatusFollowers,
  } = useQuery({
    enabled: isOwner && !!accountData.id && userId !== accountData.id,
    queryKey: ["account", "status", "followers", accountData.id],
    queryFn: () => getStatusFollowers(accountData.id),
  });

  return (
    <AccountContext.Provider
      value={{
        tabs,
        pathname,
        accountData,
        isOwner,
        isLoadingStatusFollowers,
        statusFollowers: statusFollowers || [],
        refetchStatusFollowers,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
