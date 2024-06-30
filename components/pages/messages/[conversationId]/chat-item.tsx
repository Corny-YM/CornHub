"use client";

import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";
import {
  Trash,
  ClipboardCopy,
  EllipsisVertical,
  CloudDownload,
} from "lucide-react";

import { IMessage } from "@/actions/message";
import { useToggle } from "@/hooks/useToggle";
import { TypeFileEnum } from "@/lib/enum";
import { cn, formatAmounts, formatToLocaleDate } from "@/lib/utils";
import { emotionIcons } from "@/lib/const";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ModalDelete from "./modal-delete";
import PopoverReactions from "./popover-reactions";
import ModalReacted from "./modal-reacted";
import Link from "next/link";

interface Props {
  data?: IMessage;
  isOwner?: boolean;
}

const ChatItem = ({ data, isOwner }: Props) => {
  if (!data) return null;

  const {
    file,
    sender,
    _count,
    file_id,
    content,
    deleted,
    updated_at,
    messageReactions,
  } = data;

  const [actionPopup, toggleActionPopup] = useToggle();
  const [modalDelete, toggleModalDelete] = useToggle();
  const [modalReacted, toggleModalReacted] = useToggle();

  const handleCopy = useCallback(() => {
    if (!content || file_id) return;
    navigator.clipboard.writeText(content);
    toast.success("Copy thành công");
  }, [content, file_id]);

  const isImage = useMemo(() => {
    return file?.type === TypeFileEnum.image;
  }, [file]);

  const isVideo = useMemo(() => {
    return file?.type === TypeFileEnum.video;
  }, [file]);

  const arrEmoted = useMemo(
    () =>
      messageReactions.reduce((obj, item) => {
        const tmp = obj[item.type] || 0;
        const total = tmp + 1;
        return { ...obj, [item.type]: total };
      }, {} as Record<string, number>),
    [messageReactions]
  );
  const emotionKeys = useMemo(() => Object.keys(arrEmoted), [arrEmoted]);

  const actions = useMemo(() => {
    const arr: IDropdownAction[] = [];

    if (!file && !deleted) {
      arr.push({
        label: "Sao chép",
        icon: <ClipboardCopy className="mr-2" size={16} />,
        onClick: handleCopy,
      });
    }

    if (isOwner) {
      arr.push({
        label: "Xóa",
        destructive: true,
        icon: <Trash className="mr-2" size={16} />,
        onClick: () => toggleModalDelete(true),
      });
    }

    return arr;
  }, [isOwner, file, deleted, handleCopy]);

  const contentMessage = useMemo(() => {
    if (isVideo && file)
      return (
        <div className="w-full max-w-96 flex justify-center items-center rounded-xl overflow-hidden">
          <video src={file.path} controls></video>
        </div>
      );
    if (isImage && file)
      return (
        <div className="w-full max-w-96 flex justify-center items-center rounded-xl overflow-hidden">
          <img className="w-full h-auto object-cover" src={file.path} />
        </div>
      );
    if (file && !isImage && !isVideo)
      return (
        <div
          className={cn(
            "max-w-96 break-words rounded-lg bg-zinc-400/50 dark:bg-primary-foreground px-3 py-2 leading-normal",
            deleted && "rounded-full italic text-zinc-500 dark:text-zinc-400"
          )}
        >
          <Link
            className="flex-center underline"
            target="_blank"
            href={file.path}
          >
            <span className="flex items-center line-clamp-1">
              {file.actual_name}
              <div className="w-10 h-10 flex items-center justify-center">
                <CloudDownload className="ml-2" />
              </div>
            </span>
          </Link>
        </div>
      );
    return (
      <div
        className={cn(
          "max-w-96 break-words rounded-lg bg-zinc-400/50 dark:bg-primary-foreground px-3 py-2 leading-normal",
          deleted && "rounded-full italic text-zinc-500 dark:text-zinc-400"
        )}
      >
        <div className="">{content}</div>
      </div>
    );
  }, [isVideo, isImage, file, content, deleted]);

  return (
    <div
      className={cn(
        "w-full h-fit flex group mb-4 gap-2",
        isOwner && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      {!isOwner && (
        <div className="flex items-end justify-center">
          <TooltipButton
            side="left"
            delayDuration={100}
            disableHoverableContent
            button={
              <div>
                <AvatarImg className="w-8 h-8" src={sender.avatar} />
              </div>
            }
          >
            <div className="text-xs">{sender.full_name}</div>
          </TooltipButton>
        </div>
      )}

      {/* Content */}
      <div className="relative flex items-center">
        <TooltipButton
          side="left"
          disableHoverableContent
          delayDuration={100}
          button={contentMessage}
        >
          <div className="text-xs">{formatToLocaleDate(updated_at)}</div>
        </TooltipButton>
        {/* Reactions */}
        {!!emotionKeys.length && (
          <div className="absolute right-0 -bottom-2 translate-y-1/2">
            <div
              className="flex items-center px-2 py-[2px] rounded-full bg-primary/50 cursor-pointer"
              onClick={() => toggleModalReacted(true)}
            >
              <div className="flex items-center">
                {emotionKeys.map((key) => {
                  const Icon = emotionIcons[key];
                  if (!Icon) return null;
                  return (
                    <div
                      key={key}
                      className="flex justify-center items-center w-4 h-4"
                    >
                      <Icon />
                    </div>
                  );
                })}
              </div>
              {!!_count.messageReactions && (
                <div className="leading-normal ml-1">
                  {formatAmounts(_count.messageReactions)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className={cn(
          "flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition",
          actionPopup && "opacity-100"
        )}
      >
        {!deleted && <PopoverReactions message={data} />}

        {/* <Button className="rounded-full" variant="ghost" size="icon">
          <CornerUpLeft size={16} />
        </Button> */}

        <DropdownActions
          className="!ring-0 !ring-offset-0"
          menuSide="top"
          actions={actions}
          icon={<EllipsisVertical size={16} />}
          onOpenChange={toggleActionPopup}
        />

        <ModalDelete
          message={data}
          open={modalDelete}
          onOpenChange={toggleModalDelete}
        />

        <ModalReacted
          message={data}
          reactionTypes={arrEmoted}
          open={modalReacted}
          onOpenChange={toggleModalReacted}
        />
      </div>
    </div>
  );
};

export default ChatItem;
