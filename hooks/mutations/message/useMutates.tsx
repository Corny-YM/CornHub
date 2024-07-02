import toast from "react-hot-toast";
import {
  User,
  Message,
  Conversation,
  ConversationMember,
} from "@prisma/client";
import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  addMembers,
  store as storeConversation,
  leave as leaveConversation,
  update as updateConversation,
  IStoreData as IStoreDataConversation,
  IUpdateData as IUpdateDataConversation,
  removeMembers,
} from "@/actions/conversation";
import {
  destroyMessage,
  reactionMessage,
  store as storeMessage,
  destroyReactionMessage,
  IStoreData as IStoreDataMessage,
} from "@/actions/message";

export const useMutates = () => {
  const router = useRouter();
  const { userId } = useAuth();

  // CONVERSATION
  const {
    mutateAsync: mutateAsyncUpdateConversation,
    isPending: isPendingUpdateConversation,
  } = useMutation({
    mutationKey: ["conversation", "update", userId],
    mutationFn: updateConversation,
    onSuccess() {
      toast.success("Cập nhật cuộc hội thoại thành công");
      router.refresh();
    },
    onError() {
      toast.error("Cập nhật cuộc hội thoại thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncStoreConversation,
    isPending: isPendingStoreConversation,
  } = useMutation({
    mutationKey: ["conversation", "store", userId],
    mutationFn: storeConversation,
    onSuccess() {
      toast.success("Tạo cuộc hội thoại thành công");
      router.refresh();
    },
    onError() {
      toast.error("Tạo cuộc hội thoại thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncLeaveConversation,
    isPending: isPendingLeaveConversation,
  } = useMutation({
    mutationKey: ["conversation", "leave", userId],
    mutationFn: leaveConversation,
    onSuccess() {
      toast.success("Rời nhóm thành công");
      router.refresh();
    },
    onError() {
      toast.error("Rời nhóm thất bại. Vui lòng thử lại sau");
    },
  });

  // MEMBERS
  const { mutateAsync: mutateAsyncAddMembers, isPending: isPendingAddMembers } =
    useMutation({
      mutationKey: ["conversation", "add", "members"],
      mutationFn: addMembers,
      onSuccess() {
        toast.success("Mời người dùng thành công");
        router.refresh();
      },
      onError() {
        toast.error("Mời người dùng thất bại. Vui lòng thử lại sau");
      },
    });

  const {
    mutateAsync: mutateAsyncRemoveMembers,
    isPending: isPendingRemoveMembers,
  } = useMutation({
    mutationKey: ["conversation", "remove", "members"],
    mutationFn: removeMembers,
    onSuccess() {
      toast.success("Loại bỏ thành viên thành công");
      router.refresh();
    },
    onError() {
      toast.error("Loại bỏ thành viên thất bại. Vui lòng thử lại sau");
    },
  });

  // MESSAGE
  const {
    mutateAsync: mutateAsyncStoreMessage,
    isPending: isPendingStoreMessage,
  } = useMutation({
    mutationKey: ["send", "message", "store"],
    mutationFn: storeMessage,
    onSuccess() {},
    onError() {
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại sau");
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

  // REACTION
  const {
    mutateAsync: mutateAsyncStoreReaction,
    isPending: isPendingStoreReaction,
  } = useMutation({
    mutationKey: ["message", "reaction", "store"],
    mutationFn: reactionMessage,
    onError() {
      toast.error("Thả tương tác tin nhắn thất bại. Vui lòng thử lại sau");
    },
  });

  const {
    mutateAsync: mutateAsyncDeleteReaction,
    isPending: isPendingDeleteReaction,
  } = useMutation({
    mutationKey: ["message", "reaction", "delete"],
    mutationFn: destroyReactionMessage,
    onError() {
      toast.error("Gỡ bỏ tương tác tin nhắn thất bại. Vui lòng thử lại sau");
    },
  });

  // Conversation
  const onStoreConversation = useCallback(
    async (
      data: IStoreDataConversation,
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

  const onUpdateConversation = useCallback(
    async (
      { id, data }: { id: string; data: IUpdateDataConversation },
      callback?: (val: Conversation) => void | null
    ) => {
      if (!id || !data) return;
      await mutateAsyncUpdateConversation({ id, data }).then((res) =>
        callback?.(res)
      );
    },
    []
  );

  const onLeaveConversation = useCallback(
    async (
      data: { conversationId: string; memberId: string },
      callback?: (val: Conversation) => void | null
    ) => {
      if (!data.conversationId || !data.memberId) return;
      await mutateAsyncLeaveConversation(data).then((res) => callback?.(res));
    },
    []
  );

  // Members
  const onAddMembers = useCallback(
    async (
      data: { conversationId: string; ids: string[] },
      callback?: (val: (ConversationMember & { member: User })[]) => void | null
    ) => {
      const { conversationId, ids } = data;
      if (!conversationId || !ids || !ids.length) return;
      await mutateAsyncAddMembers(data).then((res) => callback?.(res));
    },
    []
  );

  const onRemoveMembers = useCallback(
    async (
      data: { conversationId: string; memberId: string },
      callback?: (val: (ConversationMember & { member: User })[]) => void | null
    ) => {
      const { conversationId, memberId } = data;
      if (!conversationId || !memberId) return;
      await mutateAsyncRemoveMembers(data).then((res) => callback?.(res));
    },
    []
  );

  // Message
  const onStoreMessage = useCallback(
    async (
      data: IStoreDataMessage,
      callback?: (val: Message) => void | null
    ) => {
      const { conversationId, content, file } = data;
      if (!conversationId || (!content && !file)) return;
      await mutateAsyncStoreMessage(data).then((res) => callback?.(res));
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

  // Reaction
  const onStoreReaction = useCallback(
    async (
      data: { id: number; type: string; conversationId: string },
      callback?: (val: Message) => void | null
    ) => {
      const { conversationId, id, type } = data;
      if (!id || !type || !conversationId) return;
      await mutateAsyncStoreReaction(data).then((res) => callback?.(res));
    },
    []
  );

  const onDeleteReaction = useCallback(
    async (
      data: { reactionId: number; messageId: number; conversationId: string },
      callback?: (val: Message) => void | null
    ) => {
      const { conversationId, messageId, reactionId } = data;
      if (!messageId || !reactionId || !conversationId) return;
      await mutateAsyncDeleteReaction(data).then((res) => callback?.(res));
    },
    []
  );

  return {
    isPendingUpdateConversation,
    isPendingStoreConversation,
    isPendingLeaveConversation,
    isPendingDeleteReaction,
    isPendingDeleteMessage,
    isPendingStoreReaction,
    isPendingRemoveMembers,
    isPendingStoreMessage,
    isPendingAddMembers,
    onUpdateConversation,
    onStoreConversation,
    onLeaveConversation,
    onDeleteReaction,
    onDeleteMessage,
    onStoreReaction,
    onRemoveMembers,
    onStoreMessage,
    onAddMembers,
  } as const;
};
