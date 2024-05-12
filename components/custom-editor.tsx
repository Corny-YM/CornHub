"use client";

import dynamic from "next/dynamic";

const CustomEditor = dynamic(
  () => {
    return import("@/components/editor");
  },
  { ssr: false }
);

export default CustomEditor;
