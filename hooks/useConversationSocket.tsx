import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Conversation, File as IFile, User } from "@prisma/client";

import { useSocket } from "@/providers/socket-provider";

type Props = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type ConversationType = Conversation & {
  file?: IFile;
  user?: User;
  createdBy: User;
};

export const useConversationSocket = ({
  addKey,
  updateKey,
  queryKey,
}: Props) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (conversation: ConversationType) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: [
              conversation,
              ...page.items.map((item: ConversationType) => {
                if (item?.id === conversation?.id) return null;
                return item;
              }),
            ],
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    socket.on(addKey, (conversation: ConversationType) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return {
            pages: [
              {
                items: [conversation],
              },
            ],
          };

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [conversation, ...newData[0].items],
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
