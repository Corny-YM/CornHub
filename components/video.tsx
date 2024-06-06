"use client";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  src: string;
  type: string;
}

const Video = ({ className, src, type }: Props) => {
  return (
    <video className={cn(" w-full h-full ", className)} preload="auto" controls>
      <source src={src} type={type} />
    </video>
  );
};

export default Video;
