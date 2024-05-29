"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val: boolean) => void;
}

// TODO: search logic & apis

const SearchModal = ({ open, children, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-x-2 select-none">
              Tìm kiếm trên <Badge className="text-base">CornHub</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="h-full max-h-full flex flex-col"></div>

        {onOpenChange && (
          <DialogFooter>
            <Button
              className="w-full"
              type="submit"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
