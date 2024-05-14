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
      <AvatarFallback>{fallback || "CH"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarImg;
