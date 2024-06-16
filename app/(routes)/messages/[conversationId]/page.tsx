import Link from "next/link";
import {
  CirclePlay,
  FilePlus2,
  ImageUp,
  Info,
  Phone,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AvatarImg from "@/components/avatar-img";
import UserInputSending from "@/components/user-input-sending";

const ConversationIdPage = () => {
  return (
    <div className="flex-grow h-full max-h-full flex flex-col px-2 pt-4 pb-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <Button className="h-fit px-2" variant="ghost" asChild>
          <Link className="flex items-center space-x-1" href="#">
            <AvatarImg />
            <div className="font-semibold">Bình nghiện</div>
          </Link>
        </Button>

        <div className="h-full flex items-center space-x-2">
          <Button className="rounded-full" variant="ghost" size="icon">
            <Phone size={20} />
          </Button>
          <Button className="rounded-full" variant="ghost" size="icon">
            <Video size={20} />
          </Button>
          <Button className="rounded-full" variant="ghost" size="icon">
            <Info size={20} />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="flex-1 flex-grow flex flex-col overflow-hidden overflow-y-auto">
        <div className="min-h-96 flex items-center justify-center bg-red-400/50">
          Content 1
        </div>
        <div className="min-h-96 flex items-center justify-center bg-blue-400/50">
          Content 2
        </div>
        <div className="min-h-96 flex items-center justify-center bg-green-400/50">
          Content 3
        </div>
      </div>

      {/* Input */}
      <div className="w-full flex items-center space-x-2 mt-2">
        <Button className="rounded-full" variant="ghost" size="icon">
          <ImageUp size={20} />
        </Button>
        <Button className="rounded-full" variant="ghost" size="icon">
          <CirclePlay size={20} />
        </Button>
        <Button className="rounded-full" variant="ghost" size="icon">
          <FilePlus2 size={20} />
        </Button>
        <UserInputSending showAvatar={false} />
      </div>
    </div>
  );
};

export default ConversationIdPage;
