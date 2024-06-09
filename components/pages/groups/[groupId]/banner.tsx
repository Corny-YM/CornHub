"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import NoBackground from "@/public/no-background.jpg";

const Banner = () => {
  const { groupData, isGroupOwner } = useGroupContext();

  return (
    <div className="relative w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
      <div className="relative w-full h-96 aspect-video flex items-center justify-center">
        <Image
          className="absolute w-full h-full object-cover"
          src={groupData.cover || NoBackground}
          alt="banner"
          fill
          sizes="100%"
        />
      </div>
      {isGroupOwner && (
        <div className="absolute right-4 bottom-4">
          <Button variant="outline">
            <Camera size={20} className="mr-2" /> Chỉnh sửa ảnh bìa
          </Button>
        </div>
      )}
    </div>
  );
};

export default Banner;
