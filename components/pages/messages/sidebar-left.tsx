import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import AvatarImg from "@/components/avatar-img";
import Link from "next/link";

interface Props {}

const SidebarLeft = async ({}: Props) => {
  return (
    <div className="side-bar">
      <div className="w-full h-full flex flex-col px-2 border-r border-r-stone-600/30">
        <div className="text-2xl font-bold mb-4">Đoạn chat</div>
        <div className="relative w-full">
          <Input
            className="!ring-0 !ring-offset-0 rounded-full overflow-hidden pl-10"
            placeholder="Tìm kiếm trên CornHub"
          />
          <Search className="absolute top-1/2 left-2 -translate-y-1/2" />
        </div>

        <div className="flex-1 w-full flex flex-col mt-2 space-y-2 h-full overflow-hidden overflow-y-auto">
          {Array.from([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ]).map((item) => (
            <Link
              key={item}
              className="p-2 flex items-center space-x-2 rounded-lg select-none cursor-pointer transition hover:bg-primary-foreground"
              href={`/messages/${item}`}
            >
              <AvatarImg />
              <div className="flex-1 leading-normal">
                <div className="font-semibold text-sm">Bình Nghiện</div>
                <div className="text-xs opacity-75">
                  xem thi biet =))) • 1 giờ
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
