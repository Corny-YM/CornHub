"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, ButtonProps } from "@/components/ui/button";

interface Props {
  open?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  title?: string;
  description?: string;
  children: React.ReactNode;
  activator: React.ReactNode;
  footerActions?: ButtonProps[];
  onOpenChange?: (val?: boolean) => void;
}

const SheetButton = ({
  open,
  side = "right",
  title,
  children,
  activator,
  description,
  footerActions,
  onOpenChange,
}: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{activator}</SheetTrigger>
      <SheetOverlay className="z-[99999]" />
      <SheetContent className="z-[99999] w-full flex flex-col" side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 -mx-6 px-4 overflow-hidden overflow-y-auto">
          {children}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Đóng</Button>
          </SheetClose>
          {footerActions?.map((action, index) => (
            <Button key={index} {...action} />
          ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetButton;
