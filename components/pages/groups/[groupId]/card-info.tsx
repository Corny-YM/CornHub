"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
}

const CardInfo = ({ className }: Props) => {
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
      <div className="max-w-full break-words text-sm flex flex-col">
        <div className="mt-2">
          Group này được lập ra để anh em cùng hỏi đáp, trao đổi chia sẻ và show
          thành quả anh em đã làm được khi học lập trình tại F8
        </div>
        <div className="mt-2">
          Nội quy nhóm:{" "}
          <Link href="https://docs.google.com/document/d/1SwtVOoq9gFba6e36DPOeboZzVWDDbOcEMwroVoVgbAw/edit?usp=sharing">
            https://docs.google.com/document/d/1SwtVOoq9gFba6e36DPOeboZzVWDDbOcEMwroVoVgbAw/edit?usp=sharing
          </Link>
        </div>
        <div className="mt-2">
          Website:{" "}
          <Link href="https://fullstack.edu.vn/">
            https://fullstack.edu.vn/
          </Link>
        </div>
        <div className="mt-2">
          Youtube:{" "}
          <Link href="https://www.youtube.com/@F8VNOfficial">
            https://www.youtube.com/@F8VNOfficial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
