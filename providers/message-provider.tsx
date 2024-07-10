"use client";

import { createContext, useContext } from "react";

import { useToggle } from "@/hooks/useToggle";
import ModalAddConversation from "@/components/pages/messages/modal-add-conversation";
import ModalSearch from "@/components/pages/messages/modal-search";

interface Props {
  children: React.ReactNode;
}

export type MessageContext = {
  modalAdd: boolean;
  modalSearch: boolean;
  toggleModalAdd: (val?: boolean) => void;
  toggleModalSearch: (val?: boolean) => void;
};

const MessageContext = createContext<MessageContext>({
  modalAdd: false,
  modalSearch: false,
  toggleModalAdd: () => {},
  toggleModalSearch: () => {},
});

export const MessageProvider = ({ children }: Props) => {
  const [modalAdd, toggleModalAdd] = useToggle(false);
  const [modalSearch, toggleModalSearch] = useToggle(false);

  return (
    <MessageContext.Provider
      value={{ modalAdd, toggleModalAdd, modalSearch, toggleModalSearch }}
    >
      {children}
      <ModalAddConversation open={modalAdd} onOpenChange={toggleModalAdd} />
      <ModalSearch open={modalSearch} onOpenChange={toggleModalSearch} />
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  return useContext(MessageContext);
};
