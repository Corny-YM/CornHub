"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { getFiles } from "@/actions/user";
import { useAppContext } from "@/providers/app-provider";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CardFile from "@/components/card-file";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";
import { TypeFileEnum } from "@/lib/enum";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
  onSelect: (val: string) => void;
}

const ModalFiles = ({ open, onSelect, onOpenChange }: Props) => {
  const { currentUser } = useAppContext();

  const [selectedImage, setSelectedImage] = useState("");

  const { data: fileData, isLoading } = useQuery({
    enabled: !!currentUser && open,
    queryKey: ["account", "files", currentUser?.id],
    queryFn: () =>
      getFiles({ userId: currentUser?.id!, type: TypeFileEnum.image }),
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const path = target.dataset.path;
      if (!path) return;
      setSelectedImage(selectedImage !== path ? path : "");
    },
    [selectedImage]
  );

  const handleClickSelect = useCallback(() => {
    if (!selectedImage) return;
    onOpenChange(false);
    onSelect(selectedImage);
  }, [selectedImage, onSelect]);

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!fileData || !fileData.length) return <EmptyData />;
    return (
      <div className="w-full grid grid-cols-3 gap-2">
        {fileData.map((file) => {
          const { id, path, name } = file;
          return (
            <CardFile
              key={id}
              src={path}
              alt={name}
              className={cn("h-24", selectedImage === path && "border-primary")}
              onClick={handleClick}
            />
          );
        })}
      </div>
    );
  }, [selectedImage, fileData, isLoading, handleClick]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Chọn ảnh</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 h-full flex flex-col">
          <ScrollArea className="flex-1 max-h-[600px] -mx-6 px-6">
            {content}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button disabled={!selectedImage} onClick={handleClickSelect}>
            Chọn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFiles;
