import Image from "next/image";
import { DoorOpen, Ellipsis, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";

const actions: IDropdownAction[] = [
  { label: "Bỏ theo dõi", icon: <EyeOff className="mr-2" size={20} /> },
  {
    label: "Rời nhóm",
    icon: <DoorOpen className="mr-2" size={20} />,
    destructive: true,
  },
];

const GroupCard = () => {
  return (
    <div className="p-4 w-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow dark:bg-neutral-800 bg-[#f0f2f5]">
      <div className="w-full flex items-center justify-start">
        <div className="relative flex justify-center items-center w-20 h-20 aspect-square rounded-lg overflow-hidden">
          <Image
            className="absolute w-full h-full"
            src="https://i.pravatar.cc/150?img=3"
            alt="avatar_group"
            fill
          />
        </div>
        <div className="pl-3 flex flex-col justify-center">
          <div className="font-semibold w-full line-clamp-2">
            I am Programmer, I have no life
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center w-full gap-x-2">
        <Button
          className="flex-1 hover:bg-primary/50"
          variant="outline"
          size="sm"
        >
          Xem nhóm
        </Button>
        <DropdownActions
          className="hover:bg-primary/50"
          icon={<Ellipsis />}
          actions={actions}
        />
        <div></div>
      </div>
    </div>
  );
};

export default GroupCard;
