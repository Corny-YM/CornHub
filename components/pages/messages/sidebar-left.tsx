"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ElementRef, Fragment, useMemo, useRef } from "react";
import { Loader2, MessageSquareDiff, Search, ServerCrash } from "lucide-react";

import { cn, getRelativeTime } from "@/lib/utils";
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
  const pathname = usePathname();
  const { userId } = useAuth();
  const { isConnected } = useSocket();
  const { toggleModalAdd, toggleModalSearch } = useMessageContext();

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
          <Button
            className="w-full flex items-center justify-start focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl px-3 text-base !cursor-pointer dark:hover:bg-primary/50 hover:bg-primary/40 transition"
            variant="outline"
            onClick={() => toggleModalSearch(true)}
          >
            <Search className="mr-1" size={20} />
            <div className="opacity-50">Tìm kiếm trên CornHub</div>
          </Button>
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
          className="flex-1 w-full flex flex-col mt-2 space-y-1 h-full overflow-hidden overflow-y-auto"
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
                  created_by,
                  createdBy,
                  last_message,
                  last_time_online,
                } = conversation;
                const isGroupChat = type === TypeConversationEnum.group;
                const conversationId = isGroupChat
                  ? id
                  : user_id === userId
                  ? created_by
                  : user_id;
                const conversationAvatar = isGroupChat
                  ? file?.path
                  : user_id === userId
                  ? createdBy.avatar
                  : user?.avatar;
                const conversationName = isGroupChat
                  ? name
                  : user_id === userId
                  ? createdBy.full_name
                  : user?.full_name;
                const selected =
                  conversationId && pathname.includes(conversationId);
                return (
                  <Link
                    key={id}
                    className={cn(
                      "p-2 flex items-center space-x-2 rounded-lg select-none cursor-pointer transition hover:bg-primary dark:hover:bg-primary-foreground",
                      selected && "bg-primary dark:bg-primary-foreground"
                    )}
                    href={`/messages/${conversationId}`}
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
