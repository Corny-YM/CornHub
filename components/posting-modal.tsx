"use client";

import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { Earth, ImagePlus, Lock, UsersRound } from "lucide-react";

import { store } from "@/actions/post";
import { useAppContext } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";
import CustomEditor from "@/components/custom-editor";
import SelectActions, { ISelectAction } from "@/components/select-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(actions[0].value);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ["store", "post", currentUser?.id],
    mutationFn: store,
    onSuccess() {
      toast.success("Tạo bài viết thành công");
      setIsDirty(false);
      toggleOpen(false);
    },
    onError() {
      toast.success("Tạo bài viết thất bại. Vui lòng thử lại sau");
    },
  });

  const handleShowAddFile = useCallback(() => {
    inputFileRef.current?.click();
  }, []);
  const handleChangeFile = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    setFile(file);
  }, []);
  const handleChangeSelect = useCallback((val: string) => {
    setStatus(val);
  }, []);
  const handleEditorChange = useCallback((val: string) => {
    setIsDirty(true);
    setContent(val);
  }, []);
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (isDirty) return;
      toggleOpen(open);
    },
    [isDirty, toggleOpen]
  );
  const handleStorePost = useCallback(() => {
    if (!currentUser) return;
    mutate({ content, status, file, userId: currentUser.id });
  }, [content, status, file, currentUser, mutate]);

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
          <SelectActions
            defaultValue={actions[0].value}
            actions={actions}
            onChange={handleChangeSelect}
          />
        </div>
      </div>
    );
  }, [currentUser, userName, handleChangeSelect]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:w-[600px] sm:max-w-none flex flex-col">
        <DialogHeader>
          <DialogTitle>Tạo bài viết</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-full flex flex-col justify-center">
            {userContent}
            <div className="max-h-96 overflow-hidden overflow-y-auto mt-4">
              <CustomEditor
                data={content}
                placeholder={placeholder}
                onChange={handleEditorChange}
              />

              <div className="flex items-center justify-between gap-2 p-2 mt-4 border border-solid rounded-lg">
                <div>Thêm vào bài viết của bạn</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShowAddFile}
                  >
                    <ImagePlus size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <input
              ref={inputFileRef}
              multiple={false}
              style={{ display: "none" }}
              accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
              type="file"
              onChange={handleChangeFile}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            type="submit"
            size="sm"
            disabled={isPending || !content}
            onClick={handleStorePost}
          >
            Đăng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostingModal;
