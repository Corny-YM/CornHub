import toast from "react-hot-toast";
import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Conversation, Message } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { destroyMessage } from "@/actions/message";
import { IStoreData, store } from "@/actions/conversation";

export const useMutates = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const {
    mutateAsync: mutateAsyncStoreConversation,
    isPending: isPendingStoreConversation,
  } = useMutation({
    mutationKey: ["conversation", "store", userId],
    mutationFn: store,
    onSuccess() {
      toast.success("Tạo cuộc hội thoại thành công");
      router.refresh();
    },
    onError() {
      toast.error("Tạo cuộc hội thoại thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncDeleteMessage,
    isPending: isPendingDeleteMessage,
  } = useMutation({
    mutationKey: ["conversation", "message", "delete", userId],
    mutationFn: destroyMessage,
    onSuccess() {
      toast.success("Thu hôi tin nhắn thành công");
      router.refresh();
    },
    onError() {
      toast.error("Thu hôi tin nhắn thất bại. Vui lòng thử lại sau");
    },
  });

  const onStoreConversation = useCallback(
    async (data: IStoreData, callback?: (val: Conversation) => void | null) => {
      const { name, ids } = data;
      if (!name) return;
      await mutateAsyncStoreConversation({ name, ids: ids || [] }).then((res) =>
        callback?.(res)
      );
    },
    []
  );

  const onDeleteMessage = useCallback(
    async (
      data: { id: number; type: string; conversationId: string },
      callback?: (val: Message) => void | null
    ) => {
      const { id, type } = data;
      if (!id || !type) return;
      await mutateAsyncDeleteMessage(data).then((res) => callback?.(res));
    },
    []
  );

  return {
    isPendingStoreConversation,
    isPendingDeleteMessage,
    onStoreConversation,
    onDeleteMessage,
  } as const;
};
