import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import RequestSenderCard from "@/components/pages/friends/request-sender-card";

const FriendRequestsPage = async () => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const friendRequests = await prisma.friendRequest.findMany({
    include: { sender: true },
    where: { receiver_id: userId },
  });

  const senders = friendRequests.map((item) => item.sender);

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">Lời mời kết bạn</div>

      {!senders.length && <EmptyData />}

      {!!senders.length && (
        <div
          className={cn(
            "w-full grid gap-2 pb-4",
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-4",
            "min-[1440px]:grid-cols-5",
            "2xl:grid-cols-6"
          )}
        >
          {senders.map((sender) => (
            <RequestSenderCard key={sender.id} data={sender} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
