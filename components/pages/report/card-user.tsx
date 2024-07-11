"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { User } from "@prisma/client";

import { useToggle } from "@/hooks/useToggle";
import { useMutates } from "@/hooks/mutations/report/useMutates";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";
import AlertModal from "@/components/alert-modal";
import { cn } from "@/lib/utils";

interface Props {
  data: User;
}

const CardUser = ({ data }: Props) => {
  const { id, avatar, full_name, is_banned } = data;
  const { isPendingBanUser, isPendingUnBanUser, onBanUser, onUnBanUser } =
    useMutates();

  const [modalConfirm, toggleModalConfirm] = useToggle();

  const handleConfirm = useCallback(async () => {
    if (is_banned) await onUnBanUser(id);
    else await onBanUser(id);
  }, [id, is_banned]);

  return (
    <div className="w-full flex flex-col items-center justify-start overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="flex justify-center items-center relative w-full h-auto aspect-square">
        <Image
          className="absolute w-full h-full"
          src={avatar || NoAvatar}
          alt={full_name || "avatar-friends"}
          sizes="100%"
          fill
          priority
        />
      </div>
      <div className="w-full flex-1 flex flex-col justify-between p-3 gap-y-1">
        <Link
          className="font-medium hover:underline break-words line-clamp-2 leading-normal pb-1"
          href={`/account/${id}`}
          target="_blank"
        >
          {full_name}
        </Link>
        <div className="flex flex-col gap-2">
          <Button className="w-full" size="sm" asChild>
            <Link href={`/account/${id}`} target="_blank">
              Xem trang cá nhân
            </Link>
          </Button>
          <Button
            className={cn("w-full", is_banned && "hover:bg-primary/50")}
            variant={is_banned ? "outline" : "destructive"}
            size="sm"
            onClick={() => toggleModalConfirm(true)}
          >
            {is_banned ? "Bỏ cấm" : "Cấm"}
          </Button>
        </div>
      </div>

      <AlertModal
        destructive
        open={modalConfirm}
        disabled={isPendingBanUser || isPendingUnBanUser}
        onOpenChange={toggleModalConfirm}
        onClick={handleConfirm}
      />
    </div>
  );
};

export default CardUser;
