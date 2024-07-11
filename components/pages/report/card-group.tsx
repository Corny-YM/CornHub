"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { Group } from "@prisma/client";

import { useToggle } from "@/hooks/useToggle";
import { Button } from "@/components/ui/button";
import NoCover from "@/public/no-background.jpg";
import AlertModal from "@/components/alert-modal";
import { useMutates } from "@/hooks/mutations/report/useMutates";

interface Props {
  data: Group;
}

const CardGroup = ({ data }: Props) => {
  const { id, group_name, cover } = data;
  const { isPendingRemoveGroup, onRemoveGroup } = useMutates();

  const [modalConfirm, toggleModalConfirm] = useToggle();

  const handleRemove = useCallback(async () => {
    await onRemoveGroup(data.id);
  }, [data]);

  return (
    <div className="p-4 w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="w-full flex items-center justify-start">
        <div className="relative flex justify-center items-center w-20 h-20 aspect-square rounded-lg overflow-hidden">
          <Image
            className="absolute w-full h-full object-cover"
            src={cover || NoCover}
            alt="avatar_group"
            fill
            sizes="w-20"
          />
        </div>
        <div className="pl-3 flex flex-col justify-center">
          <div className="font-semibold w-full line-clamp-2">{group_name}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center w-full gap-x-2">
        <Button
          className="flex-1 hover:bg-primary/50"
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/groups/${id}`}>Xem nhóm</Link>
        </Button>
        <Button
          className="flex-1"
          variant="destructive"
          size="sm"
          onClick={() => toggleModalConfirm(true)}
        >
          Xóa
        </Button>
      </div>

      <AlertModal
        destructive
        open={modalConfirm}
        disabled={isPendingRemoveGroup}
        onOpenChange={toggleModalConfirm}
        onClick={handleRemove}
      />
    </div>
  );
};

export default CardGroup;
