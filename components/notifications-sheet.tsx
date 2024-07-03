"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { useToggle } from "@/hooks/useToggle";
import { getByUserId } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import SheetButton from "@/components/sheet-button";
import Notification from "@/components/icons/notification";

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
      <div className="h-[1000px]">theanh</div>
    </SheetButton>
  );
};

export default NotificationsSheet;
