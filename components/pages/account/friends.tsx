"use client";

import Image from "next/image";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import FriendButtonActions from "./friend-button-actions";

const fakeFriends = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const Friends = () => {
  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl mb-4">Bạn bè</div>

        {/* Tabs */}
        <div className="w-full flex items-center gap-x-2">
          <Button className="hover:bg-primary/50" variant="outline">
            Tất cả bạn bè
          </Button>
          <Button className="hover:bg-primary/50" variant="outline">
            Đang theo dõi
          </Button>
        </div>

        {/* List Friends */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          {fakeFriends.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center p-4 shadow-lg rounded-lg border border-solid border-gray-400/10"
            >
              {/* avatar */}
              <div className="relative w-20 h-20 flex justify-center items-center rounded-lg overflow-hidden mr-4">
                <Image
                  className="absolute w-full h-full"
                  src={item}
                  alt="friend-alt"
                  fill
                />
              </div>
              {/* info */}
              <div className="flex-1 flex flex-col justify-center pr-4">
                <div className="font-semibold line-clamp-2">Nguyễn Thế Anh</div>
                <div className="text-sm">8 bạn chung</div>
              </div>
              {/*  */}
              <div className="flex items-center justify-center">
                <FriendButtonActions>
                  <Button
                    className="rounded-full hover:bg-primary/50"
                    variant="outline"
                    size="icon"
                  >
                    <Ellipsis size={20} />
                  </Button>
                </FriendButtonActions>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
