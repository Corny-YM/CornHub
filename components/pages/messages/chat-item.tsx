"use client";

import { useMemo } from "react";
import { CornerUpLeft, EllipsisVertical, Smile } from "lucide-react";

import { emotionIcons, emotions } from "@/lib/const";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import TooltipButton from "@/components/tooltip-button";

interface Props {
  isVideo?: boolean;
  isImage?: boolean;
}

const ChatItem = ({ isVideo, isImage }: Props) => {
  const Icon = emotionIcons.smile;

  const contentMessage = useMemo(() => {
    if (isVideo)
      return (
        <div className="w-full max-w-96 flex justify-center items-center rounded-xl overflow-hidden">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/corny-chat.appspot.com/o/vids%2FSnapinsta.app_video_320818149_898193808406779_4714380023283603170_n.mp4?alt=media&token=ce7c116f-ef05-4f9c-bc43-1b31e0cb4a05"
            controls
          ></video>
        </div>
      );
    if (isImage)
      return (
        <div className="w-full max-w-96 flex justify-center items-center rounded-xl overflow-hidden">
          <img className="" src="https://i.pravatar.cc/150?img=3" />
        </div>
      );
    return (
      <div className="rounded-full bg-primary-foreground px-3 py-2 leading-normal">
        <div className="">Đây là tin nhắn</div>
      </div>
    );
  }, []);

  return (
    <div className="w-full h-fit flex group mb-4">
      <div className="flex items-end justify-center mr-2">
        <AvatarImg className="w-8 h-8" />
      </div>
      <div className="relative flex items-center">
        <TooltipButton side="left" delayDuration={100} button={contentMessage}>
          <div className="text-xs">28/01/23, 19:55</div>
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

      <div className="flex items-center space-x-1 ml-1 opacity-0 group-hover:opacity-100 transition">
        <TooltipButton
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

        <Button className="rounded-full" variant="ghost" size="icon">
          <CornerUpLeft size={16} />
        </Button>
        <Button className="rounded-full" variant="ghost" size="icon">
          <EllipsisVertical size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ChatItem;
