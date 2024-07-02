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
  title?: string;
  description?: string;
  children: React.ReactNode;
  activator: React.ReactNode;
  footerActions?: ButtonProps[];
}

const SheetButton = ({
  title,
  children,
  activator,
  description,
  footerActions,
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{activator}</SheetTrigger>
      <SheetOverlay className="z-[99999]" />
      <SheetContent className="z-[99999] w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden overflow-y-auto">{children}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Đóng</Button>
          </SheetClose>
          {footerActions?.map((action) => (
            <Button {...action} />
          ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetButton;
