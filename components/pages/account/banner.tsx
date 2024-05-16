"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAccountContext } from "@/providers/account-provider";
import NoBackground from "@/public/no-background.jpg";

const Banner = () => {
  const { accountData, isOwner } = useAccountContext();

  return (
    <div className="relative w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
      <div className="relative w-full h-96 aspect-video flex items-center justify-center">
        <Image
          className="absolute w-full h-full object-cover"
          src={accountData?.cover || NoBackground}
          alt="banner"
          fill
        />
      </div>
      {isOwner && (
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
