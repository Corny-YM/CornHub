"use client";

import { createContext, useContext } from "react";

import { useToggle } from "@/hooks/useToggle";
import ModalAddConversation from "@/components/pages/messages/modal-add-conversation";

interface Props {
  children: React.ReactNode;
}

export type MessageContext = {
  modalAdd: boolean;
  toggleModalAdd: (val?: boolean) => void;
};

const MessageContext = createContext<MessageContext>({
  modalAdd: false,
  toggleModalAdd: () => {},
});

export const MessageProvider = ({ children }: Props) => {
  const [modalAdd, toggleModalAdd] = useToggle(false);

  return (
    <MessageContext.Provider value={{ modalAdd, toggleModalAdd }}>
      {children}
      <ModalAddConversation open={modalAdd} onOpenChange={toggleModalAdd} />
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  return useContext(MessageContext);
};
