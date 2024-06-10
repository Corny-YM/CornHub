import React, { forwardRef } from "react";

import {
  Select,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

interface Props {
  selectLabel?: string;
  placeholder?: React.ReactNode;
  value?: string;
  onValueChange: (val: string) => void;
  options: { value: string; label: string }[];
}

const InputSelect = forwardRef<HTMLButtonElement, Props>(
  ({ selectLabel, placeholder, options, value, onValueChange }, ref) => {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <SelectGroup>
            {!!selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
            {options.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

export default InputSelect;
