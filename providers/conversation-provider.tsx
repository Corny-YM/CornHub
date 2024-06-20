"use client";

import { useAuth } from "@clerk/nextjs";
import { Conversation, User, File as IFile } from "@prisma/client";
import { createContext, useContext, useMemo, useState } from "react";

import { IDispatchState } from "@/types";
import { TypeConversationEnum } from "@/lib/enum";

interface Props {
  children: React.ReactNode;
  data: Conversation & {
    createdBy: User;
    user?: User | null;
    file?: IFile | null;
  };
}

export type ConversationContext = {
  isGroupChat: boolean;
  userUrl?: string | null;
  conversationAvatar?: string | null;
  conversationName?: string | null;
  conversationData: Props["data"];
  setConversationData: IDispatchState<Props["data"]>;
};

const ConversationContext = createContext<ConversationContext>({
  isGroupChat: false,
  conversationData: {} as Props["data"],
  setConversationData: () => {},
});

export const ConversationProvider = ({ children, data }: Props) => {
  const { userId } = useAuth();
  const [conversationData, setConversationData] = useState(data);

  const { name, file, user, createdBy, type } = conversationData;

  const isGroupChat = useMemo(
    () => type === TypeConversationEnum.group,
    [type]
  );

  const userUrl = useMemo(() => {
    if (userId === createdBy.id) return `/account/${createdBy.id}`;
    if (user) return `/account/${user.id}`;
  }, [userId, user, createdBy]);

  const conversationAvatar = useMemo(() => {
    if (isGroupChat) return file?.path;
    return userId === user?.id ? createdBy.avatar : user?.avatar;
  }, [userId, file, user, createdBy, isGroupChat]);

  const conversationName = useMemo(() => {
    if (isGroupChat) return name;
    return userId === user?.id ? createdBy.full_name : user?.full_name;
  }, [userId, name, user, createdBy, isGroupChat]);

  return (
    <ConversationContext.Provider
      value={{
        userUrl,
        isGroupChat,
        conversationAvatar,
        conversationName,
        conversationData,
        setConversationData,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  return useContext(ConversationContext);
};
