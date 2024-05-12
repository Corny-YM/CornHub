"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Podcast, Image as ImageIcon, Laugh } from "lucide-react";

import CustomEditor from "@/components/custom-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Posting = () => {
  const { user } = useUser();

  if (!user) return null;
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center px-4 py-3 overflow-hidden rounded-lg dark:bg-neutral-800 bg-[#f0f2f5]">
        <div className="w-full flex items-center">
          {/* User Info */}
          <div className="flex justify-between items-center">
            <div className="relative flex justify-center items-center w-9 h-9 mr-3 overflow-hidden rounded-full">
              <Image
                className="absolute w-full h-full aspect-square"
                priority
                src={user?.imageUrl || ""}
                alt={user?.fullName || ""}
                fill
              />
            </div>
          </div>
          {/* Input */}
          <div className="flex-1 flex items-center">
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl px-5 text-base !cursor-pointer dark:hover:bg-primary/50 hover:bg-primary/40 transition"
              placeholder="Corny ơi, bạn đang nghĩ gì thế?"
              disabled
            />
          </div>
        </div>

        <Separator className="mt-3 mb-2 dark:bg-neutral-200/50 bg-neutral-400" />
        <div className="w-full flex items-center justify-between gap-x-2">
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
            >
              <Podcast className="mr-1 text-rose-500" />
              Video trực tiếp
            </Button>
          </div>
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
            >
              <ImageIcon className="mr-1 text-green-500/80" />
              Ảnh/video
            </Button>
          </div>
          <div className="flex items-center flex-1">
            <Button
              className="w-full rounded-lg hover:bg-primary/50"
              variant="outline"
            >
              <Laugh className="mr-1 text-orange-300" />
              Cảm xúc/hoạt động
            </Button>
          </div>
        </div>

        <CustomEditor data="theanh" />
      </div>
    </div>
  );
};

export default Posting;
