"use client";

import { useToggle } from "@/hooks/useToggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
  activator: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleButton = ({ activator, children }: Props) => {
  const [openSetting, toggleOpenSetting] = useToggle(false);

  return (
    <Collapsible
      className="w-full space-y-2"
      open={openSetting}
      onOpenChange={toggleOpenSetting}
    >
      <CollapsibleTrigger asChild>{activator}</CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleButton;
