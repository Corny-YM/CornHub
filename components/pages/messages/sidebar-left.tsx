"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Conversation, User, File as IFile } from "@prisma/client";

import { getRelativeTime } from "@/lib/utils";
import { TypeConversationEnum } from "@/lib/enum";
import { useMessageContext } from "@/providers/message-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";

interface Props {
  conversations: (Conversation & {
    user?: User | null;
    createdBy: User;
    file?: IFile | null;
  })[];
}

const SidebarLeft = ({ conversations }: Props) => {
  const { userId } = useAuth();

  const { toggleModalAdd } = useMessageContext();

  return (
    <div className="side-bar">
      <div className="w-full h-full flex flex-col px-2 border-r border-r-stone-600/30">
        <div className="text-2xl font-bold mb-4">Đoạn chat</div>
        <div className="relative w-full">
          <Input
            className="!ring-0 !ring-offset-0 rounded-full overflow-hidden pl-10"
            placeholder="Tìm kiếm trên CornHub"
          />
          <Search className="absolute top-1/2 left-2 -translate-y-1/2" />
        </div>

        <div className="flex-1 w-full flex flex-col mt-2 space-y-2 h-full overflow-hidden overflow-y-auto">
          {!conversations.length && (
            <div className="w-full flex flex-col items-center space-y-4 mt-2">
              <div className="w-full flex items-center justify-center text-justify italic text-xs px-1">
                Bạn chưa có cuộc hội thoại nào. Hãy tạo nhóm chat hoặc tìm kiếm
                bạn bè nhé
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
          {conversations.map((conversation) => {
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
                  <div className="font-semibold text-sm">
                    {conversationName}
                  </div>
                  <div className="text-xs opacity-75">
                    {last_message} • {getRelativeTime(last_time_online)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
