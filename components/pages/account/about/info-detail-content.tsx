"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ILucideIcon } from "@/types";
import { isValidURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useAccountContext } from "@/providers/account-provider";

interface Props {
  link?: boolean;
  icon: ILucideIcon;
  label: React.ReactNode | string;
}

const InfoDetailContent = ({ link, label, icon: Icon }: Props) => {
  const { isOwner } = useAccountContext();

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
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center">
        <Icon />
        <div className="ml-2">{content}</div>
      </div>
      {isOwner && (
        <Button
          className="rounded-full overflow-hidden hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          <Ellipsis size={20} />
        </Button>
      )}
    </div>
  );
};

export default InfoDetailContent;
