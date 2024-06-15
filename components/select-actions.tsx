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
import { ILucideIcon } from "@/types";

export interface ISelectAction {
  value: string;
  label: React.ReactNode;
  icon?: ILucideIcon;
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
      <SelectContent className="z-[9999]">
        <SelectGroup>
          {actions.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center">
                {Icon && <Icon className="mr-2" size={20} />} {label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectActions;
