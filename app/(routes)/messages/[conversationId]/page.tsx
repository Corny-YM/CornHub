"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2, ServerCrash } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ElementRef, Fragment, useMemo, useRef } from "react";

import { index } from "@/actions/message";
import { useChatScroll } from "@/hooks/useChatScroll";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useSocket } from "@/providers/socket-provider";
import { useConversationContext } from "@/providers/conversation-provider";
import ChatItem from "@/components/pages/messages/[conversationId]/chat-item";
import ChatWelcome from "@/components/pages/messages/[conversationId]/chat-welcome";
import Loading from "@/components/icons/loading";

const ConversationIdPage = () => {
  const { userId } = useAuth();
  const { isConnected } = useSocket();
  const { conversationData } = useConversationContext();

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const queryKey = useMemo(
    () => `conversation:${conversationData.id}`,
    [conversationData]
  );
  const addKey = useMemo(() => `${queryKey}:messages`, [queryKey]);
  const updateKey = useMemo(() => `${queryKey}:messages:update`, [queryKey]);

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: async (queryParams) => {
        return await index({
          cursor: queryParams.pageParam,
          conversationId: conversationData.id,
        });
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items.length ?? 0,
    loadMore: fetchNextPage,
  });

  if (status === "pending")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Đang tải tin nhắn...
        </p>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Đã xảy ra lỗi!
        </p>
      </div>
    );

  return (
    <div
      className="flex-1 flex-grow flex flex-col -mx-2 px-2 overflow-hidden overflow-y-auto"
      ref={chatRef}
    >
      <div className="flex-1 flex flex-col items-center">
        {!hasNextPage && (
          <div className="flex-1">
            <ChatWelcome />
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loading />
            ) : (
              <button
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                onClick={() => fetchNextPage()}
              >
                Tải tin nhắn trước đó
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex-grow flex flex-col-reverse justify-end">
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((message) => {
              if (!message) return null;
              return (
                <ChatItem
                  key={message.id}
                  data={message}
                  isOwner={message.sender_id === userId}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ConversationIdPage;
