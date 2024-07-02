"use client";

import { useAuth } from "@clerk/nextjs";
import { Conversation, User, File as IFile } from "@prisma/client";
import { createContext, useContext, useMemo, useState } from "react";

import { IDispatchState } from "@/types";
import { TypeConversationEnum } from "@/lib/enum";
import { useToggle } from "@/hooks/useToggle";

interface Props {
  children: React.ReactNode;
  data: Conversation & {
    createdBy: User;
    user?: User | null;
    file?: IFile | null;
  };
}

export type ConversationContext = {
  call: boolean;
  callVideo: boolean;
  isOwner: boolean;
  isGroupChat: boolean;
  userUrl?: string | null;
  conversationAvatar?: string | null;
  conversationName?: string | null;
  conversationData: Props["data"];
  toggleCall: (val?: boolean) => void;
  toggleCallVideo: (val?: boolean) => void;
  setConversationData: IDispatchState<Props["data"]>;
};

const ConversationContext = createContext<ConversationContext>({
  call: false,
  callVideo: false,
  isOwner: false,
  isGroupChat: false,
  conversationData: {} as Props["data"],
  toggleCall: () => {},
  toggleCallVideo: () => {},
  setConversationData: () => {},
});

export const ConversationProvider = ({ children, data }: Props) => {
  const { userId } = useAuth();
  const [conversationData, setConversationData] = useState(data);

  const [call, toggleCall] = useToggle();
  const [callVideo, toggleCallVideo] = useToggle();

  const { name, file, user, createdBy, created_by, type } = conversationData;

  const isOwner = useMemo(() => created_by === userId, [created_by, userId]);

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
        call,
        callVideo,
        userUrl,
        isOwner,
        isGroupChat,
        conversationAvatar,
        conversationName,
        conversationData,
        toggleCall,
        toggleCallVideo,
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
