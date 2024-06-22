"use client";

import { Fragment } from "react";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";

import { index } from "@/actions/message";
import { useSocket } from "@/providers/socket-provider";
import { useConversationContext } from "@/providers/conversation-provider";
import ChatItem from "@/components/pages/messages/chat-item";

const ConversationIdPage = () => {
  const { userId } = useAuth();
  const { isConnected } = useSocket();
  const { conversationData } = useConversationContext();

  const {
    data,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useInfiniteQuery({
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined,
    queryKey: [`conversation:${conversationData.id}`],
    queryFn: async (queryParams) => {
      console.log(queryParams);
      return await index({
        cursor: queryParams.pageParam,
        conversationId: conversationData.id,
      });
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });

  return (
    <div className="flex-1 flex-grow flex flex-col overflow-hidden overflow-y-auto">
      <div className="flex-1 flex-grow flex flex-col-reverse justify-end">
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((message) => (
              <ChatItem
                key={message.id}
                data={message}
                isOwner={message.sender_id === userId}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConversationIdPage;
