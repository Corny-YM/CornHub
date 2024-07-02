"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { acceptFriendRequest, deniedFriendRequest } from "@/actions/user";
import { Button } from "@/components/ui/button";
import NoAvatar from "@/public/no-avatar.jpg";

interface Props {
  data: User;
}

const RequestSenderCard = ({ data }: Props) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [senderData, setSenderData] = useState<User>(data);
  const [status, setStatus] = useState<"accept" | "denied" | null>(null);

  const {
    mutate: mutateAcceptFriendRequest,
    isPending: isPendingAcceptFriendRequest,
  } = useMutation({
    mutationKey: ["account", "unfriend", userId, senderData.id],
    mutationFn: acceptFriendRequest,
    onSuccess() {
      setStatus("accept");
      toast.success(
        `Đã chấp nhận lời mời kết bạn của "${senderData.full_name}"`
      );
      router.refresh();
    },
    onError() {
      toast.error("Chấp nhận lời mời thất bại. Vui lòng thử lại sau");
    },
  });
  const {
    mutate: mutateDeniedFriendRequest,
    isPending: isPendingDeniedFriendRequest,
  } = useMutation({
    mutationKey: ["account", "denied-request", userId, senderData.id],
    mutationFn: deniedFriendRequest,
    onSuccess() {
      setStatus("denied");
      toast.success(`Đã từ chối lời mời kết bạn của "${senderData.full_name}"`);
    },
    onError() {
      toast.error("Từ chối lời mời thất bại. Vui lòng thử lại sau");
    },
  });

  const handleAcceptFriendRequest = useCallback(() => {
    if (!userId || !senderData) return;
    mutateAcceptFriendRequest({ userId, friendId: senderData.id });
  }, [userId, senderData]);

  const handleDeniedFriendRequest = useCallback(() => {
    if (!userId || !senderData) return;
    mutateDeniedFriendRequest({ userId, friendId: senderData.id });
  }, [userId, senderData]);

  const contentStatus = useMemo(() => {
    if (status === "accept") return "Đã chấp nhận yêu cầu";
    return "Đã xóa yêu cầu";
  }, [status]);

  const contentActions = useMemo(
    () => (
      <>
        <Button
          className="w-full hover:bg-primary/50"
          size="sm"
          disabled={isPendingAcceptFriendRequest}
          onClick={handleAcceptFriendRequest}
        >
          Xác nhận
        </Button>
        <Button
          className="w-full hover:bg-destructive/20"
          variant="outline"
          size="sm"
          disabled={isPendingDeniedFriendRequest}
          onClick={handleDeniedFriendRequest}
        >
          Xóa
        </Button>
      </>
    ),
    [
      isPendingAcceptFriendRequest,
      isPendingDeniedFriendRequest,
      handleAcceptFriendRequest,
      handleDeniedFriendRequest,
    ]
  );

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="flex justify-center items-center relative w-full h-auto aspect-square">
        <Image
          className="absolute w-full h-full"
          src={senderData.avatar || NoAvatar}
          alt={senderData.full_name || "avatar-friends"}
          fill
          sizes="100%"
        />
      </div>
      <div className="w-full flex flex-col p-3 gap-y-1">
        <div className="font-medium">{senderData.full_name}</div>
        {!status ? (
          contentActions
        ) : (
          <Button className="select-none" disabled variant="outline">
            {contentStatus}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RequestSenderCard;
