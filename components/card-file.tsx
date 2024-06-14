"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const CardFile = ({ src, alt, className, onClick }: Props) => {
  return (
    <div
      data-path={src}
      className={cn(
        "group relative w-full h-auto",
        "flex justify-center items-center",
        "rounded-md overflow-hidden cursor-pointer transition",
        "border-2 border-solid border-transparent",
        className
      )}
      onClick={onClick}
    >
      <Image
        className="absolute w-full h-full object-cover"
        src={src}
        alt={alt}
        fill
        sizes="100%"
      />
      <div className="absolute inset-0 group-hover:bg-slate-200/10 transition"></div>
    </div>
  );
};

export default CardFile;
