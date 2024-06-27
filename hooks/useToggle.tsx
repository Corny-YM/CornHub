"use client";

import { useCallback, useState } from "react";

import { isUndefined } from "@/lib/utils";

export const useToggle = (bol?: boolean) => {
  const [open, setOpen] = useState(bol || false);

  const toggleOpen = useCallback((val?: boolean) => {
    if (!isUndefined(val)) return setOpen(!!val);
    return setOpen((prev) => !prev);
  }, []);

  return [open, toggleOpen] as const;
};
