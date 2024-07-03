"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { useToggle } from "@/hooks/useToggle";
import { getByUserId } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import SheetButton from "@/components/sheet-button";
import EmptyData from "@/components/empty-data";
import AvatarImg from "@/components/avatar-img";
import Loading from "@/components/icons/loading";
import Notification from "@/components/icons/notification";
import { TypeNotificationEnum } from "@/lib/enum";

const NotificationsSheet = () => {
  const { userId } = useAuth();
  const [open, toggleOpen] = useToggle();

  const { data, isLoading } = useQuery({
    enabled: !!userId && open,
    queryKey: ["user", "notifications", userId],
    queryFn: () => getByUserId(userId!),
  });

  return (
    <SheetButton
      title="Thông báo"
      description="Tất cả thông báo của bạn ở đây"
      open={open}
      onOpenChange={toggleOpen}
      activator={
        <Button
          className="z-50 flex justify-center items-center w-10 h-10 p-2 rounded-full outline-none hover:bg-primary/50"
          variant="outline"
          size="icon"
        >
          <Notification />
        </Button>
      }
    >
      <div className="">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        )}
        {!isLoading && (!data || !data.length) && <EmptyData />}
        {data?.map((notification) => {
          const {
            id,
            url,
            type,
            post,
            group,
            reply,
            sender,
            comment,
            description,
          } = notification;

          let __html = description;

          // if(type === TypeNotificationEnum.)

          return (
            <Link
              key={id}
              href={url}
              className="flex items-stretch w-full p-2 rounded-lg overflow-hidden hover:bg-zinc-400/50 dark:hover:bg-primary-foreground/50"
            >
              <div className="h-full flex items-start justify-center mr-2">
                <AvatarImg src={sender.avatar} />
              </div>
              <div className="leading-normal">
                <div dangerouslySetInnerHTML={{ __html }} />
              </div>
            </Link>
          );
        })}
      </div>
    </SheetButton>
  );
};

export default NotificationsSheet;
