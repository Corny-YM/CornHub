import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Conversation, File as IFile, User } from "@prisma/client";

import { useSocket } from "@/providers/socket-provider";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type ConversationType = Record<string, any> &
  Conversation & {
    file?: IFile;
    user?: User;
    createdBy: User;
  };

export const useConversationSocket = ({
  addKey,
  updateKey,
  queryKey,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { userId } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // TODO: socket remove member
    socket.on(updateKey, (conversation: ConversationType) => {
      const memberDeleted = conversation.member_deleted;
      if (
        memberDeleted &&
        userId === memberDeleted &&
        pathname.includes(conversation.id)
      ) {
        toast.error("Bạn đã bị loại ra khỏi nhóm");
        window.location.reload();
        // router.push("/messages");
        // router.refresh();
      }

      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: [
              !memberDeleted && userId !== memberDeleted ? conversation : null,
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
  }, [
    userId,
    socket,
    router,
    addKey,
    pathname,
    queryKey,
    updateKey,
    queryClient,
  ]);
};
