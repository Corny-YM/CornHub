import { GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";

const InfoDetail = () => {
  return (
    <div className="sticky top-0" style={{ position: "-webkit-sticky" }}>
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl">Giới thiệu</div>
        <div className="pt-4">
          <div>Đây là phần tiểu sử</div>
          <Button className="w-full mt-2 hover:bg-primary/50" variant="outline">
            Chỉnh sửa tiểu sử
          </Button>
        </div>

        {/* Detail */}
        <div className="w-full pt-4">
          <div className="flex items-center">
            <div className="min-w-8 h-8 flex justify-center items-center mr-2">
              <GraduationCap size={20} />
            </div>
            <div className="line-clamp-1 text-sm">
              Học Công Nghệ Thông Tin tại Đại Học Công Nghệ Đông Á
            </div>
          </div>
          <div className="flex items-center">
            <div className="min-w-8 h-8 flex justify-center items-center mr-2">
              <GraduationCap size={20} />
            </div>
            <div className="line-clamp-1 text-sm">Sống tại Hà Nội</div>
          </div>

          <Button className="w-full mt-2 hover:bg-primary/50" variant="outline">
            Chỉnh sửa chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoDetail;
