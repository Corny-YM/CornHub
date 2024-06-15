"use client";

import { cn, formatDate } from "@/lib/utils";
import { useGroupContext } from "@/providers/group-provider";
import { CalendarPlus2 } from "lucide-react";

interface Props {
  className?: string;
}

const CardInfo = ({ className }: Props) => {
  const { groupData } = useGroupContext();

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-center",
        "px-4 py-3 overflow-hidden rounded-lg",
        "dark:bg-neutral-800 bg-[#f0f2f5]",
        className
      )}
    >
      <div className="font-semibold">Giới thiệu</div>
      {!groupData.description && (
        <div className="flex items-center">
          <CalendarPlus2 className="mr-2 " />
          <span>
            Đã tạo vào ngày{" "}
            <b>{formatDate(groupData.created_at, "/", false)}</b>
          </span>
        </div>
      )}
      <div
        className="max-w-full break-words text-sm flex flex-col"
        dangerouslySetInnerHTML={{ __html: groupData.description || "" }}
      ></div>
    </div>
  );
};

export default CardInfo;
