import Image from "next/image";
import { DoorOpen, Ellipsis, EyeOff } from "lucide-react";

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

const CardMember = () => {
  return (
    <div className="w-full min-h-11 flex items-center p-2 rounded-lg overflow-hidden shadow-lg dark:bg-neutral-800/50 bg-[#f0f2f5]">
      <div className="relative flex justify-center items-center w-14 h-14 rounded-full overflow-hidden">
        <Image
          className="absolute w-full h-full"
          src="https://i.pravatar.cc/150?img=3"
          alt="member_avatar"
          fill
          sizes="w-14"
        />
      </div>
      <div className="flex-1 px-3 line-clamp-2">Nguyễn Thế Anh</div>
      <div className="flex justify-center items-center h-full">
        <DropdownActions
          className="hover:bg-primary/50"
          actions={actions}
          icon={<Ellipsis />}
        />
      </div>
    </div>
  );
};

export default CardMember;
