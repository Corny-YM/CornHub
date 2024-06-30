import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { File as IFile, Message, User } from "@prisma/client";

import { OptionDeleteMessageEnum } from "@/lib/enum";
import { useSocket } from "@/providers/socket-provider";
import { useConversationContext } from "@/providers/conversation-provider";
import { IConversation } from "@/actions/conversation";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithSenderWithFile = Record<string, any> &
  Message & {
    sender: User;
    file?: IFile;
  };

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const queryClient = useQueryClient();

  const { socket } = useSocket();
  const { setConversationData } = useConversationContext();

  useEffect(() => {
    if (!socket) return;

    socket.on(queryKey, (conversation: IConversation) => {
      setConversationData((prev) => ({
        ...prev,
        name: conversation.name,
        file_id: conversation.file_id,
        file: conversation.file,
      }));
    });

    socket.on(updateKey, (message: MessageWithSenderWithFile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithSenderWithFile) => {
              if (item?.id === message?.id) {
                if (message?.option === OptionDeleteMessageEnum.terminate)
                  return null;
                return message;
              }
              return item;
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    socket.on(addKey, (message: MessageWithSenderWithFile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, socket, addKey, queryKey, updateKey]);
};
