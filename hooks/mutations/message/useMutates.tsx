import toast from "react-hot-toast";
import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CommentReply, Conversation } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { IConversationData, storeConversation } from "@/actions/message";

export const useMutates = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const {
    mutateAsync: mutateAsyncStoreConversation,
    isPending: isPendingStoreConversation,
  } = useMutation({
    mutationKey: ["message", "store", "conversation", userId],
    mutationFn: storeConversation,
    onSuccess() {
      toast.success("Tạo cuộc hội thoại thành công");
      router.refresh();
    },
    onError() {
      toast.error("Tạo cuộc hội thoại thất bại. Vui lòng thử lại sau");
    },
  });

  const onStoreConversation = useCallback(
    async (
      data: IConversationData,
      callback?: (val: Conversation) => void | null
    ) => {
      const { name, ids } = data;
      if (!name) return;
      await mutateAsyncStoreConversation({ name, ids: ids || [] }).then((res) =>
        callback?.(res)
      );
    },
    []
  );

  return { isPendingStoreConversation, onStoreConversation } as const;
};
