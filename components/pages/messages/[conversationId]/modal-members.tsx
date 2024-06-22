"use client";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getMembers } from "@/actions/conversation";
import { useConversationContext } from "@/providers/conversation-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/icons/loading";
import EmptyData from "@/components/empty-data";
import CardMember from "./card-member";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const ModalMembers = ({ open, onOpenChange }: Props) => {
  const { conversationData, isGroupChat } = useConversationContext();

  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const enabled = useMemo(
    () =>
      open &&
      isGroupChat &&
      !!conversationData &&
      !Object.keys(selectedIds).length,
    [selectedIds, isGroupChat, conversationData, open]
  );

  const { data, isLoading } = useQuery({
    enabled,
    queryKey: ["conversation", "members", conversationData.id],
    queryFn: () => getMembers(conversationData.id),
  });

  useEffect(() => {
    if (!data) return;
    const result = data.reduce((obj, item) => {
      return { ...obj, [item.member_id]: item.member };
    }, {});
    setSelectedIds(result);
  }, [data]);

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      );
    if (!data || !data.length) return <EmptyData />;
    return data.map((item) => <CardMember key={item.id} data={item.member} />);
  }, [data, isLoading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] w-screen md:max-w-[784px] sm:w-[600px] sm:max-w-none flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Thành viên</DialogTitle>
          <DialogDescription className="text-xs">
            Danh sách thành viên ở đây.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 h-ful flex flex-col">
          <ScrollArea className="h-[600px] -mx-6 px-6">
            <div className="space-y-2">{content}</div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMembers;
