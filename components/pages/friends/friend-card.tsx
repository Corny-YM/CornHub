import { Button } from "@/components/ui/button";
import Image from "next/image";

const FriendCard = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="flex justify-center items-center relative w-full h-auto aspect-square">
        <Image
          className="absolute w-full h-full"
          src="https://i.pravatar.cc/150?img=3"
          alt="avatar-friends"
          fill
        />
      </div>
      <div className="w-full flex flex-col p-3 gap-y-1">
        <div className="font-medium">Nguyễn Thế Anh</div>
        <Button
          className="w-full hover:bg-primary/50"
          variant="outline"
          size="sm"
        >
          Bỏ theo dõi
        </Button>
        <Button className="w-full" variant="destructive" size="sm">
          Hủy kết bạn
        </Button>
      </div>
    </div>
  );
};

export default FriendCard;
