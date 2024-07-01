"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { emotions } from "@/lib/const";
import { cn, formatAmounts } from "@/lib/utils";
import { IMessage, getReactions } from "@/actions/message";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "@/components/icons/loading";
import EmptyData from "@/components/empty-data";
import CardMember from "./card-member";

interface Props {
  open: boolean;
  message: IMessage;
  reactionTypes: Record<string, number>;
  onOpenChange: (val?: boolean) => void;
}

const defaultType = "all";

const ModalReacted = ({
  open,
  message,
  reactionTypes,
  onOpenChange,
}: Props) => {
  const [currentType, setCurrentType] = useState(defaultType);

  const { data, isLoading, refetch } = useQuery({
    enabled: !!message.id && open,
    queryKey: ["mesage", "reactions", message.id, currentType],
    queryFn: () => getReactions(message.id, { type: currentType }),
  });

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    const type = target.dataset.type;
    if (!type) return;
    setCurrentType(type);
  }, []);

  const contentTitle = useMemo(
    () =>
      Object.keys(reactionTypes).map((key) => {
        const total = reactionTypes[key] || 0;
        const emotion = emotions.find((emo) => emo.type === key);
        if (!emotion) return null;
        const { color, icon: Icon } = emotion;
        return (
          <Button
            key={key}
            className={cn(
              currentType === key &&
                "bg-primary hover:bg-primary dark:bg-primary-foreground dark:hover:bg-primary-foreground/90"
            )}
            data-type={key}
            variant="outline"
            onClick={handleClick}
          >
            <div className="w-5 h-5 flex justify-center items-center mr-2">
              <Icon />
            </div>
            {!!total && <div style={{ color }}>{formatAmounts(total)}</div>}
          </Button>
        );
      }),
    [reactionTypes, currentType]
  );

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      );
    if (!data || !data.length) return <EmptyData />;
    return data.map((item) => (
      <CardMember
        key={item.id}
        data={item.user}
        type={item.type}
        messageReaction={item}
        refetch={refetch}
      />
    ));
  }, [data, isLoading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] w-screen md:max-w-[784px] sm:w-[600px] sm:max-w-none flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>
            <ScrollArea className="w-[calc(100%-20px)] pb-3">
              <div className="w-full flex gap-2 items-center">
                <Button
                  className={cn(
                    currentType === defaultType &&
                      "bg-primary hover:bg-primary dark:bg-primary-foreground dark:hover:bg-primary-foreground/90"
                  )}
                  data-type={defaultType}
                  variant="outline"
                  onClick={handleClick}
                >
                  Tất cả
                </Button>
                {contentTitle}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 h-full flex flex-col">
          <ScrollArea className="h-[600px] -mx-6 px-6">
            <div className="space-y-2">{content}</div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalReacted;
