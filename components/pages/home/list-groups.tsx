"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@prisma/client";

interface Props {
  groups: Group[];
}

const ListGroups = ({ groups }: Props) => {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const id = target.dataset.id;
      if (!id) return;
      router.push(`/groups/${id}`);
    },
    [router]
  );

  return (
    <div className="w-full flex flex-col">
      {!groups.length && (
        <div className="opacity-60 px-4 text-sm">
          <i>Bạn chưa tham gia nhóm nào</i>
        </div>
      )}
      {groups.map((item) => (
        <div
          key={item.id}
          data-id={item.id}
          className="px-2 flex justify-center items-center min-h-11"
          onClick={handleClick}
        >
          <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
            <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
              <Image
                className="absolute w-full h-full aspect-square"
                priority
                src={item.cover}
                alt={"Group"}
                fill
              />
            </div>
            <div className="font-semibold line-clamp-2 py-3 text-sm">
              {item.group_name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListGroups;
