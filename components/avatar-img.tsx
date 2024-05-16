"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoAvatar from "@/public/no-avatar.jpg";
import Image from "next/image";

interface Props {
  className?: string;
  src?: string | null;
  alt?: string | null;
  fallback?: React.ReactNode;
}

const AvatarImg = ({ className, src, alt, fallback }: Props) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src!} alt={alt!} />
      <AvatarFallback>
        <div className="relative w-full h-full dark:bg-primary/50 bg-slate-400/50 flex justify-center items-center select-none rounded-full overflow-hidden">
          {fallback || (
            <Image
              className="absolute w-full h-full"
              alt="no-avatar-friend"
              src={NoAvatar}
              fill
            />
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;
