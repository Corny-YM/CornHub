import { CircleAlert } from "lucide-react";
import React from "react";

const EmptyData = () => {
  return (
    <div className="w-full flex justify-center items-center border border-solid border-neutral-400/50 rounded-lg overflow-hidden px-4 py-2 bg-primary/20">
      <div className="flex justify-center items-center mr-3 text-primary">
        <CircleAlert />
      </div>
      <div>Không tìm thấy dữ liệu</div>
    </div>
  );
};

export default EmptyData;
