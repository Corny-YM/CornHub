"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
        <div className="w-full h-full dark:bg-primary/50 bg-slate-400/50 flex justify-center items-center select-none">
          {fallback || "CH"}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;
