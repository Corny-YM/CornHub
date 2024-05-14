import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ISelectAction {
  value: string;
  label: React.ReactNode;
}

interface Props {
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  actions: ISelectAction[];
  onChange?: (val: string) => void;
}

const SelectActions = ({
  defaultValue,
  placeholder = "Select lists",
  className,
  actions,
  onChange,
}: Props) => {
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger
        className={cn("w-[180px] py-1 outline-none focus:ring-0", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup>
          {actions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectActions;
