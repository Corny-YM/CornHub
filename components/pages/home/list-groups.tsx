"use client";

import Image from "next/image";
import Link from "next/link";
import { Group } from "@prisma/client";

import NoBackground from "@/public/no-background.jpg";

interface Props {
  groups: Group[];
}

const ListGroups = ({ groups }: Props) => {
  return (
    <div className="w-full flex flex-col">
      {!groups.length && (
        <div className="opacity-60 px-4 text-sm">
          <i>Bạn chưa tham gia nhóm nào</i>
        </div>
      )}
      {groups.map((item) => (
        <Link
          key={item.id}
          className="px-2 flex justify-center items-center min-h-11"
          href={`/groups/${item.id}`}
        >
          <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
            <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
              <Image
                className="absolute w-full h-full aspect-square"
                priority
                src={item.cover || NoBackground}
                alt={"Group"}
                fill
                sizes="w-9"
              />
            </div>
            <div className="font-semibold line-clamp-2 py-3 text-sm">
              {item.group_name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ListGroups;
