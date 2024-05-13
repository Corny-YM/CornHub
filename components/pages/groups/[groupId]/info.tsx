"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

const fakeFriends = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
];
const length = fakeFriends.length;

const Info = () => {
  return (
    <div className="w-full relative flex items-center px-4">
      <div className="flex-1 h-full flex flex-col justify-center pt-6 pb-4">
        <div className="text-2xl font-semibold">
          Học lập trình web (F8 - Fullstack.edu.vn)
        </div>
        <div>
          <a className="hover:underline w-fit" href="/">
            224 thành viên
          </a>
        </div>
        <div className="w-full flex items-center">
          {fakeFriends.map((item, index) => (
            <div
              key={index}
              className="friends-icon"
              style={{ zIndex: length - index }}
            >
              <Image className="w-full h-full" src={item} alt={item} fill />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center">
        <Button variant="outline">
          <Pencil className="mr-2" size={20} />
          Chỉnh sửa nhóm
        </Button>
      </div>
    </div>
  );
};

export default Info;
