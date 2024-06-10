"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ILucideIcon } from "@/types";
import { isValidURL } from "@/lib/utils";

interface Props {
  link?: boolean;
  icon: ILucideIcon;
  label: React.ReactNode | string;
}

const InfoDetailContent = ({ link, label, icon: Icon }: Props) => {
  const content = useMemo(() => {
    if (!link || typeof label !== "string" || !isValidURL(label)) return label;
    const parsedUrl = new URL(label);
    const hostname = parsedUrl.hostname;
    return (
      <Link
        href={label}
        className="hover:underline text-blue-400"
        target="_blank"
      >
        {hostname}
      </Link>
    );
  }, [link, label]);

  return (
    <div className="flex items-center">
      <div className="min-w-8 h-8 flex justify-center items-center mr-2">
        <Icon size={20} />
      </div>
      <div className="w-full line-clamp-1 text-sm">{content}</div>
    </div>
  );
};

export default InfoDetailContent;
