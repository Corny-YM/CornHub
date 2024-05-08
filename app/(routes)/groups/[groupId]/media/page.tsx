import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import React from "react";

const GroupIdMediaPage = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-4 pb-4 px-4 xl:px-0 gap-4">
      <div className="w-full flex flex-col p-4 rounded-lg shadow-sm dark:bg-neutral-800 bg-[#f0f2f5]">
        <div className="flex items-center justify-between gap-2 text-xl font-semibold mb-4">
          <div>File phương tiện</div>
          <Button size="sm">
            <ImagePlus className="mr-2" size={20} />
            Thêm ảnh/video
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button className="hover:bg-primary/50" variant="outline" size="sm">
            Ảnh
          </Button>
          <Button className="hover:bg-primary/50" variant="outline" size="sm">
            Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupIdMediaPage;
