"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { IDispatchState } from "@/types";
import Video from "./video";

interface Props {
  file: File;
  setFile: IDispatchState;
}

const PostingPreviewFile = ({ file, setFile }: Props) => {
  const isImg = useMemo(() => {
    const type = file.type;
    return type.includes("image");
  }, [file]);

  const fileUrl = useMemo(() => {
    const url = URL.createObjectURL(file);
    return url;
  }, [file]);

  return (
    <div className="relative w-full flex items-center justify-center mt-4 rounded-lg">
      {isImg && (
        <div className="relative w-full aspect-square flex justify-center items-center rounded-md overflow-hidden border border-solid">
          <Image
            className="absolute w-full h-full"
            src={fileUrl}
            alt="preview-img"
            fill
          />
        </div>
      )}
      {!isImg && <Video src={fileUrl} type={file.type} />}

      <Button
        className="absolute top-1 right-1 rounded-full w-7 h-7"
        variant="destructive"
        size="icon"
        onClick={() => setFile(null)}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default PostingPreviewFile;
