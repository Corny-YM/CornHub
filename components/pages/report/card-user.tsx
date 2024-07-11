"use client";

import Link from "next/link";
import Image from "next/image";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";

interface Props {
  data: User;
}

const CardUser = ({ data }: Props) => {
  const { id, avatar, full_name } = data;

  return (
    <div className="w-full h-fit flex flex-col items-center justify-start overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="flex justify-center items-center relative w-full h-auto aspect-square">
        <Image
          className="absolute w-full h-full"
          src={avatar || NoAvatar}
          alt={full_name || "avatar-friends"}
          fill
          sizes="100%"
        />
      </div>
      <div className="w-full flex flex-col p-3 gap-y-1">
        <Link
          className="font-medium hover:underline break-words line-clamp-2 leading-normal pb-1"
          href={`/account/${id}`}
          target="_blank"
        >
          {full_name}
        </Link>
        <Button
          className="w-full hover:bg-primary/50"
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/account/${id}`} target="_blank">
            Xem trang cá nhân
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CardUser;
