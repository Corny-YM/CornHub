"use client";

import { Follower, User, UserDetail } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useContext, createContext, useMemo, useState, useEffect } from "react";

import { useToggle } from "@/hooks/useToggle";
import { getStatusFollowers } from "@/actions/user";
import ModalInfoDetails from "@/components/pages/account/modal-info-details";

interface Props {
  children: React.ReactNode;
  data: User & { userDetails: UserDetail[] };
}

type Context = {
  isOwner: boolean;
  accountData: User & { userDetails: UserDetail[] };
  pathname?: string;
  modalEdit: boolean;
  statusFollowers: Follower[];
  isLoadingStatusFollowers: boolean;
  tabs: Array<{ url: string; label: string }>;
  refetchStatusFollowers: () => void;
  toggleModalEdit: (val?: boolean) => void;
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
  modalEdit: false,
  statusFollowers: [],
  accountData: {} as User & { userDetails: UserDetail[] },
  isLoadingStatusFollowers: false,
  toggleModalEdit: () => {},
  refetchStatusFollowers: () => {},
});

export const AccountProvider = ({ children, data }: Props) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const [modalEdit, toggleModalEdit] = useToggle(false);
  const [accountData, setAccountData] = useState(data);

  const isOwner = useMemo(() => {
    return userId === accountData.id;
  }, [accountData]);

  useEffect(() => {
    if (!data) return;
    setAccountData(data);
  }, [data]);

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
        modalEdit,
        toggleModalEdit,
        refetchStatusFollowers,
      }}
    >
      {children}
      <ModalInfoDetails open={modalEdit} onOpenChange={toggleModalEdit} />
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
