"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const fakeFriends = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];
const length = fakeFriends.length;

const Info = () => {
  const { user } = useUser();

  const avatar = useMemo(() => {
    if (!user) return "";
    return user.imageUrl;
  }, [user]);

  return (
    <div className="w-full relative flex items-center px-4">
      {/* Avatar */}
      <div className="absolute left-4 bottom-2">
        <div className="relative w-40 h-40 flex justify-center items-center rounded-full overflow-hidden border border-solid border-neutral-900/50">
          <Image
            className="absolute w-full h-full"
            src={avatar}
            alt="avatar"
            fill
          />
        </div>
      </div>
      <div className="w-40 mr-4"></div>
      {/* Friends */}
      <div className="flex-1 h-full flex flex-col justify-center pt-6 pb-4">
        <div className="text-2xl font-semibold">Nguyễn Thế Anh</div>
        <div>
          <a className="hover:underline w-fit" href="#">
            224 bạn bè
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
          Chỉnh sửa trang cá nhân
        </Button>
      </div>
    </div>
  );
};

export default Info;
