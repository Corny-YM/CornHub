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
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";

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
    queryFn: () => getFiles({ userId: currentUser?.id!, type: "image" }),
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
            <div
              key={id}
              data-path={path}
              className={cn(
                "group relative w-full h-24",
                "flex justify-center items-center",
                "rounded-md overflow-hidden cursor-pointer transition",
                "border-2 border-solid border-transparent",
                selectedImage === path && "border-primary"
              )}
              onClick={handleClick}
            >
              <Image
                className="absolute w-full h-full object-cover"
                src={path}
                alt={name}
                fill
                sizes="100%"
              />
              <div className="absolute inset-0 group-hover:bg-slate-200/10 transition"></div>
            </div>
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
        <div className="flex-1 h-ful flex flex-col">
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
