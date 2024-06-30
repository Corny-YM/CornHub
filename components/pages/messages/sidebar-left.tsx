"use client";

import Link from "next/link";
import { ElementRef, Fragment, useMemo, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, MessageSquareDiff, Search, ServerCrash } from "lucide-react";

import { getRelativeTime } from "@/lib/utils";
import { index } from "@/actions/conversation";
import { TypeConversationEnum } from "@/lib/enum";
import { useSocket } from "@/providers/socket-provider";
import { useMessageContext } from "@/providers/message-provider";
import { useConversationSocket } from "@/hooks/useConversationSocket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";

interface Props {}

const SidebarLeft = ({}: Props) => {
  const { userId } = useAuth();
  const { isConnected } = useSocket();
  const { toggleModalAdd } = useMessageContext();

  const conversationRef = useRef<ElementRef<"div">>(null);
  const topRef = useRef<ElementRef<"div">>(null);

  const queryKey = useMemo(() => `${userId}:conversation`, [userId]);
  const addKey = useMemo(() => `${queryKey}:list`, [queryKey]);
  const updateKey = useMemo(() => `${queryKey}:list:update`, [queryKey]);

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: async (queryParams) => {
        return await index({ cursor: queryParams.pageParam });
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

  useConversationSocket({ queryKey, addKey, updateKey });
  // useChatScroll({
  //   chatRef: conversationRef,
  //   bottomRef: topRef,
  //   shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  //   count: data?.pages?.[0]?.items.length ?? 0,
  //   loadMore: fetchNextPage,
  // });

  return (
    <div className="side-bar basis-[360px]">
      <div className="w-full h-full flex flex-col px-2 border-r border-r-stone-600/30">
        <div className="text-2xl font-bold mb-4 flex items-center justify-between">
          <div>Đoạn chat</div>
          <Button
            className="rounded-full"
            size="icon"
            variant="outline"
            onClick={() => toggleModalAdd(true)}
          >
            <MessageSquareDiff size={20} />
          </Button>
        </div>
        <div className="relative w-full">
          <Input
            className="!ring-0 !ring-offset-0 rounded-full overflow-hidden pl-10"
            placeholder="Tìm kiếm trên CornHub"
          />
          <Search className="absolute top-1/2 left-2 -translate-y-1/2" />
        </div>

        {status === "pending" && (
          <div className="flex flex-col flex-1 justify-center items-center mt-2">
            <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Đang tải các cuộc hội thoại...
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col flex-1 justify-center items-center mt-2">
            <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Đã xảy ra lỗi!
            </p>
          </div>
        )}
        <div
          className="flex-1 w-full flex flex-col mt-2 space-y-2 h-full overflow-hidden overflow-y-auto"
          ref={conversationRef}
        >
          {data?.pages?.map((page, index) => (
            <Fragment key={index}>
              {!page.items.length && (
                <div className="w-full flex flex-col items-center space-y-4 mt-2">
                  <div className="w-full flex items-center justify-center text-justify italic text-xs px-1">
                    Bạn chưa có cuộc hội thoại nào. Hãy tạo nhóm chat hoặc tìm
                    kiếm bạn bè nhé
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => toggleModalAdd(true)}
                  >
                    Tạo hội thoại mới
                  </Button>
                </div>
              )}
              {page.items.map((conversation) => {
                if (!conversation) return null;
                const {
                  id,
                  name,
                  user,
                  file,
                  type,
                  user_id,
                  createdBy,
                  last_message,
                  last_time_online,
                } = conversation;
                const isGroupChat = type === TypeConversationEnum.group;
                const conversationAvatar = isGroupChat
                  ? file?.path
                  : user_id === userId
                  ? user?.avatar
                  : createdBy.avatar;
                const conversationName = isGroupChat
                  ? name
                  : user_id === userId
                  ? user?.full_name
                  : createdBy.full_name;
                return (
                  <Link
                    key={id}
                    className="p-2 flex items-center space-x-2 rounded-lg select-none cursor-pointer transition hover:bg-primary-foreground"
                    href={`/messages/${id}`}
                  >
                    <AvatarImg isChat src={conversationAvatar} />
                    <div className="flex-1 leading-normal">
                      <div className="line-clamp-2 font-semibold text-sm">
                        {conversationName}
                      </div>
                      <div className="flex w-full text-xs opacity-75 space-x-1">
                        <span className="max-w-full line-clamp-1 break-all">
                          {last_message || "Bắt đầu cuộc trò chuyện"}
                        </span>
                        <span>•</span>
                        <span className="min-w-fit">
                          {getRelativeTime(last_time_online)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
