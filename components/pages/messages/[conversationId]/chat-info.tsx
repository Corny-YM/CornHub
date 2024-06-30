"use client";

import Link from "next/link";
import {
  Info,
  Images,
  Pencil,
  Palette,
  FileText,
  ThumbsUp,
  BellRing,
  CaseSensitive,
  ChevronsUpDown,
  CircleUserRound,
  UserRoundPlus,
} from "lucide-react";
import { useCallback, useMemo, useRef } from "react";

import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/message/useMutates";
import { useConversationContext } from "@/providers/conversation-provider";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import SheetButton from "@/components/sheet-button";
import CollapsibleButton from "@/components/collapsible-button";
import ModalUpdate from "./modal-update";
import ModalAddMembers from "./modal-add-members";

const ChatInfo = () => {
  const {
    userUrl,
    isGroupChat,
    conversationData,
    conversationName,
    conversationAvatar,
  } = useConversationContext();
  const { isPendingUpdateConversation, onUpdateConversation } = useMutates();

  const [modalAdd, toggleModalAdd] = useToggle(false);
  const [modalUpdate, toggleModalUpdate] = useToggle(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const content = useMemo(() => {
    if (isGroupChat) return conversationName;
    return (
      <Link href={userUrl || ""} className="font-semibold hover:underline">
        {conversationName}
      </Link>
    );
  }, [userUrl, isGroupChat, conversationName, conversationData]);

  const handleChangeFile = useCallback(
    async (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file || !target) return;
      await onUpdateConversation({
        id: conversationData.id,
        data: { file: file, name: conversationData.name! },
      });
      target.value = "";
    },
    [conversationData, onUpdateConversation]
  );

  return (
    <SheetButton
      title="Thông tin về cuộc trò chuyện"
      activator={
        <Button className="rounded-full" variant="ghost" size="icon">
          <Info size={20} />
        </Button>
      }
    >
      <div className="w-full h-full">
        {/* User Info */}
        <div className="w-full flex flex-col items-center justify-center">
          <AvatarImg
            className="w-20 h-20"
            isChat={isGroupChat}
            src={conversationAvatar}
            alt={conversationName}
          />
          {content}
          {!isGroupChat && (
            <div className="flex items-center space-x-4 my-2">
              <div className="flex flex-col items-center">
                <Button
                  className="rounded-full w-9 h-9 p-1"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link href={`/account`}>
                    <CircleUserRound size={20} />
                  </Link>
                </Button>
                <div className="text-sm">Trang cá nhân</div>
              </div>
              <div className="flex flex-col items-center">
                <Button
                  className="rounded-full w-9 h-9"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link href="#">
                    <BellRing />
                  </Link>
                </Button>
                <div className="text-sm">Thông báo</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col mt-4 space-y-2">
          <CollapsibleButton
            activator={
              <Button
                className="w-full flex items-center justify-between"
                variant="ghost"
                size="sm"
              >
                Tùy chỉnh đoạn chat
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            }
          >
            {isGroupChat && (
              <>
                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleModalUpdate(true)}
                >
                  <Pencil size={20} className="mr-2" />
                  Đổi tên đoạn chat
                </Button>
                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  size="sm"
                  disabled={isPendingUpdateConversation}
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Images size={20} className="mr-2" />
                  Thay đổi ảnh
                </Button>
              </>
            )}

            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              size="sm"
            >
              <Palette size={20} className="mr-2" />
              Đổi chủ đề
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              size="sm"
            >
              <ThumbsUp size={20} className="mr-2" />
              Thay đổi biểu tượng cảm xúc
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              size="sm"
            >
              <CaseSensitive size={20} className="mr-2" />
              Chỉnh sửa biệt danh
            </Button>

            {isGroupChat && (
              <Button
                className="w-full flex items-center justify-start"
                variant="outline"
                size="sm"
                onClick={() => toggleModalAdd(true)}
              >
                <UserRoundPlus size={20} className="mr-2" />
                Thêm thành viên
              </Button>
            )}
          </CollapsibleButton>

          <CollapsibleButton
            activator={
              <Button
                className="w-full flex items-center justify-between"
                variant="ghost"
                size="sm"
              >
                File phương tiện & file
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            }
          >
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              size="sm"
            >
              <Images size={20} className="mr-2" />
              File phương tiện
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              size="sm"
            >
              <FileText size={20} className="mr-2" />
              File
            </Button>
          </CollapsibleButton>
        </div>
      </div>

      <input
        ref={inputFileRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        accept="image/*"
        type="file"
        onChange={handleChangeFile}
      />
      <ModalAddMembers open={modalAdd} onOpenChange={toggleModalAdd} />
      <ModalUpdate open={modalUpdate} onOpenChange={toggleModalUpdate} />
    </SheetButton>
  );
};

export default ChatInfo;
