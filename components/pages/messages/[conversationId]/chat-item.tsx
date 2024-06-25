"use client";

import toast from "react-hot-toast";
import {
  Smile,
  Trash,
  Pencil,
  ClipboardCopy,
  EllipsisVertical,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Message, User, File as IFile } from "@prisma/client";

import { useToggle } from "@/hooks/useToggle";
import { TypeFileEnum } from "@/lib/enum";
import { cn, formatToLocaleDate } from "@/lib/utils";
import { emotionIcons, emotions } from "@/lib/const";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";
import ModalDelete from "./modal-delete";

interface Props {
  data?: Message & { sender: User; file?: IFile };
  isOwner?: boolean;
}

const ChatItem = ({ data, isOwner }: Props) => {
  if (!data) return null;
  const Icon = emotionIcons.smile;

  const { sender, file, file_id, content, deleted, updated_at } = data;
  const [actionPopup, toggleActionPopup] = useToggle(false);
  const [modalDelete, toggleModalDelete] = useToggle(false);

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
      if (!deleted) {
        arr.push({
          label: "Chỉnh sửa",
          icon: <Pencil className="mr-2" size={16} />,
        });
      }
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
    return (
      <div
        className={cn(
          "max-w-96 break-words rounded-lg bg-primary-foreground px-3 py-2 leading-normal",
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
        <div className="absolute right-0 bottom-0 translate-y-1/2">
          <div className="flex items-center px-1 py-[2px] rounded-full bg-primary-foreground/50">
            <div className="flex justify-center items-center w-4 h-4">
              <Icon />
            </div>
            <div className="flex justify-center items-center w-4 h-4">
              <Icon />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className={cn(
          "flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition",
          actionPopup && "opacity-100"
        )}
      >
        {!deleted && (
          <TooltipButton
            delayDuration={100}
            className="rounded-full"
            button={
              <Button className="rounded-full" variant="ghost" size="icon">
                <Smile size={16} />
              </Button>
            }
          >
            <div className="flex items-center justify-center gap-1">
              {emotions.map(({ label, type, icon: Icon }) => (
                <div
                  key={label}
                  data-type={type}
                  className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-solid cursor-pointer transition-all hover:scale-110"
                  // onClick={() => {}}
                >
                  <Icon />
                </div>
              ))}
            </div>
          </TooltipButton>
        )}

        {/* <Button className="rounded-full" variant="ghost" size="icon">
          <CornerUpLeft size={16} />
        </Button> */}

        <DropdownActions
          className="!ring-0 !ring-offset-0"
          icon={<EllipsisVertical size={16} />}
          actions={actions}
          onOpenChange={toggleActionPopup}
        />

        <ModalDelete
          message={data}
          open={modalDelete}
          onOpenChange={toggleModalDelete}
        />
      </div>
    </div>
  );
};

export default ChatItem;
