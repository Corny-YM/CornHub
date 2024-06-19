"use client";

import Image from "next/image";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoAvatar from "@/public/no-avatar.jpg";
import NoBackground from "@/public/no-background.jpg";
import NoChatAvatar from "@/public/no_chat_avatar.png";

interface Props {
  isChat?: boolean;
  isGroup?: boolean;
  className?: string;
  src?: string | null;
  alt?: string | null;
  fallback?: React.ReactNode;
}

const AvatarImg = ({
  src,
  alt,
  isChat,
  isGroup,
  fallback,
  className,
}: Props) => {
  const fallBackSrc = useMemo(() => {
    if (isGroup) return NoBackground;
    if (isChat) return NoChatAvatar;
    return NoAvatar;
  }, [isChat, isGroup]);

  return (
    <Avatar className={cn("select-none", className)}>
      <AvatarImage className="object-cover" src={src!} alt={alt!} />
      <AvatarFallback>
        <div className="relative w-full h-full dark:bg-primary/50 bg-slate-400/50 flex justify-center items-center select-none rounded-full overflow-hidden">
          {fallback || (
            <Image
              className="absolute w-full h-full"
              alt="no-avatar-friend"
              src={fallBackSrc}
              fill
              sizes="100%"
            />
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;
