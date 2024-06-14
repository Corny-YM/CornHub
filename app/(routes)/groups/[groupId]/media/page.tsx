"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { TypeFileEnum } from "@/lib/enum";
import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import { getFiles } from "@/actions/group";
import Loading from "@/components/icons/loading";
import EmptyData from "@/components/empty-data";
import CardFile from "@/components/card-file";

const GroupIdMediaPage = () => {
  const { groupData, isGroupOwner } = useGroupContext();

  const [type, setType] = useState(TypeFileEnum.image);

  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { data: fileData, isLoading } = useQuery({
    enabled: !!groupData.id,
    queryKey: ["group", "files", groupData.id, type],
    queryFn: () => getFiles(groupData.id, { type }),
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!fileData || !fileData.length) return <EmptyData />;
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {fileData.map((file) => (
          <CardFile
            key={file.id}
            className="h-full aspect-square"
            src={file.path}
            alt={file.name}
          />
        ))}
      </div>
    );
  }, [fileData, isLoading]);

  const handleChangeFile = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    setFile(file);
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center mt-4 pb-4 px-4 xl:px-0 gap-4">
      <div className="w-full flex flex-col p-4 rounded-lg shadow-sm dark:bg-neutral-800 bg-[#f0f2f5]">
        <div className="flex items-center justify-between gap-2 text-xl font-semibold mb-4">
          <div>File phương tiện</div>
          {/* {isGroupOwner && (
            <Button size="sm" onClick={() => inputFileRef.current?.click()}>
              <ImagePlus className="mr-2" size={20} />
              Thêm ảnh/video
            </Button>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <Button
            className={cn(
              "hover:bg-primary/50",
              type === TypeFileEnum.image && "bg-primary/50"
            )}
            variant="outline"
            size="sm"
            onClick={() => setType(TypeFileEnum.image)}
          >
            Ảnh
          </Button>
          <Button
            className={cn(
              "hover:bg-primary/50",
              type === TypeFileEnum.video && "bg-primary/50"
            )}
            variant="outline"
            size="sm"
            onClick={() => setType(TypeFileEnum.video)}
          >
            Video
          </Button>
        </div>

        <div className="mt-4">{content}</div>
      </div>

      <input
        ref={inputFileRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        accept="image/*"
        type="file"
        onChange={handleChangeFile}
      />
    </div>
  );
};

export default GroupIdMediaPage;
