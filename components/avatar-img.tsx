"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoAvatar from "@/public/no-avatar.jpg";
import NoBackground from "@/public/no-background.jpg";
import Image from "next/image";

interface Props {
  className?: string;
  isGroup?: boolean;
  src?: string | null;
  alt?: string | null;
  fallback?: React.ReactNode;
}

const AvatarImg = ({ className, isGroup, src, alt, fallback }: Props) => {
  return (
    <Avatar className={cn("select-none", className)}>
      <AvatarImage src={src!} alt={alt!} />
      <AvatarFallback>
        <div className="relative w-full h-full dark:bg-primary/50 bg-slate-400/50 flex justify-center items-center select-none rounded-full overflow-hidden">
          {fallback || (
            <Image
              className="absolute w-full h-full"
              alt="no-avatar-friend"
              src={!isGroup ? NoAvatar : NoBackground}
              fill
            />
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;
