"use client";

import { useMemo } from "react";
import { Earth, Lock, UsersRound } from "lucide-react";

import SelectActions, { ISelectAction } from "@/components/select-actions";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomEditor from "@/components/custom-editor";

interface Props {
  open: boolean;
  toggleOpen: (val?: boolean) => void;
}

const actions: ISelectAction[] = [
  {
    value: "friends",
    label: (
      <div className="w-full flex items-center">
        <UsersRound size={20} className="mr-2" />
        Bạn bè
      </div>
    ),
  },
  {
    value: "public",
    label: (
      <div className="w-full flex items-center">
        <Earth size={20} className="mr-2" />
        Công khai
      </div>
    ),
  },
  {
    value: "hide",
    label: (
      <div className="w-full flex items-center">
        <Lock size={20} className="mr-2" />
        Chỉ mình tôi
      </div>
    ),
  },
];

const PostingModal = ({ open, toggleOpen }: Props) => {
  const { currentUser } = useAppContext();

  const userName = useMemo(() => {
    if (!currentUser) return;
    return currentUser.full_name!;
  }, [currentUser]);

  const placeholder = useMemo(() => {
    return `${userName} ơi, bạn đang nghĩ gì thế?`;
  }, [userName]);

  const userContent = useMemo(() => {
    if (!currentUser) return null;
    return (
      <div className="w-full flex">
        <Avatar className="mr-2">
          <AvatarImage src={currentUser.avatar || undefined} alt={userName} />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center justify-between">
          <div className="font-semibold">{userName}</div>
          <SelectActions defaultValue={actions[0].value} actions={actions} />
        </div>
      </div>
    );
  }, [currentUser, userName]);

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo bài viết</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="w-full flex flex-col justify-center gap-2">
          {userContent}
          <CustomEditor data="" placeholder={placeholder} />
        </div>

        <DialogFooter>
          <Button className="w-full" type="submit" size="sm">
            Đăng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostingModal;
