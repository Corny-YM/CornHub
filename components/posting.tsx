"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Podcast, Image as ImageIcon, Laugh } from "lucide-react";

import { useToggle } from "@/hooks/useToggle";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PostingModal from "@/components/posting-modal";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  groupId?: number;
  onPostingSuccess?: () => void;
}

const Posting = ({ className, groupId, onPostingSuccess }: Props) => {
  const { currentUser, toastFeatureUpdating } = useAppContext();

  const [modalEditor, toggleModalEditor] = useToggle(false);

  const handleClickLiveStream = useCallback(() => {
    toastFeatureUpdating();
  }, [toastFeatureUpdating]);
  const handleClickUpload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleModalEditor(true);
    },
    [toggleModalEditor]
  );

  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <div className="w-full flex flex-col justify-center items-center px-4 py-3 overflow-hidden rounded-lg dark:bg-neutral-800 bg-[#f0f2f5]">
        <div className="w-full flex items-center">
          {/* User Info */}
          {currentUser && (
            <div className="flex justify-between items-center">
              <div className="relative flex justify-center items-center w-9 h-9 mr-3 overflow-hidden rounded-full">
                <Image
                  className="absolute w-full h-full aspect-square"
                  priority
                  src={currentUser.avatar || "/no-avatar.jpg"}
                  alt={currentUser.full_name || "user-avatar"}
                  fill
                  sizes="w-9"
                />
              </div>
            </div>
          )}
          {/* Input */}
          <div className="flex-1 flex items-center">
            <Button
              className="w-full flex items-center justify-start focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl px-5 text-base !cursor-pointer dark:hover:bg-primary/50 hover:bg-primary/40 transition"
              variant="outline"
              onClick={handleClickUpload}
            >
              <div className="opacity-60 text-sm">
                Corny ơi, bạn đang nghĩ gì thế?
              </div>
            </Button>
          </div>
        </div>

        <Separator className="mt-3 mb-2 dark:bg-neutral-200/50 bg-neutral-400" />
        <div className="w-full flex items-center justify-between gap-x-2">
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
              onClick={handleClickLiveStream}
            >
              <Podcast className="mr-1 text-rose-500" />
              Video trực tiếp
            </Button>
          </div>
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
              onClick={handleClickUpload}
            >
              <ImageIcon className="mr-1 text-green-500/80" />
              Ảnh/video
            </Button>
          </div>
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
              onClick={handleClickUpload}
            >
              <Laugh className="mr-1 text-orange-300" />
              Cảm xúc/hoạt động
            </Button>
          </div>
        </div>
      </div>

      <PostingModal
        groupId={groupId}
        open={modalEditor}
        toggleOpen={toggleModalEditor}
        onSuccess={onPostingSuccess}
      />
    </div>
  );
};

export default Posting;
