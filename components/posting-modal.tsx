"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Group, Post, User, File as IFile } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Earth, ImagePlus, Lock, UsersRound } from "lucide-react";

import { store, update } from "@/actions/post";
import { useAppContext } from "@/providers/app-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SelectActions, { ISelectAction } from "@/components/select-actions";
import PostingPreviewFile from "@/components/posting-preview-file";
import CustomEditor from "@/components/custom-editor";
import { useToggle } from "@/hooks/useToggle";
import AlertModal from "./alert-modal";

interface Props {
  groupId?: number | null;
  open: boolean;
  data?: Post & { user: User; group: Group | null; file: IFile | null };
  toggleOpen: (val?: boolean) => void;
  onSuccess?: (
    res: Post & { user: User; group: Group | null; file: IFile | null }
  ) => void;
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

const defaultStatus = actions[0].value;

const PostingModal = ({
  groupId,
  data,
  open,
  toggleOpen,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const { currentUser } = useAppContext();

  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(defaultStatus);
  const [modalConfirm, toggleModalConfirm] = useToggle(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const isUpdating = !!data?.id;

  useEffect(() => {
    if (!data) return;
    setStatus(data.status);
    setContent(data.content || "");
    setMediaUrl(data.file?.path || "");
  }, [data, open]);

  const { mutate: mutateStore, isPending: isPendingStore } = useMutation({
    mutationKey: ["store", "post", currentUser?.id],
    mutationFn: store,
    onSuccess(res) {
      toast.success("Tạo bài viết thành công");
      router.refresh();
      setContent("");
      setFile(null);
      setStatus(defaultStatus);
      toggleOpen(false);
      onSuccess?.(res);
    },
    onError() {
      toast.error("Tạo bài viết thất bại. Vui lòng thử lại sau");
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["store", "post", currentUser?.id],
    mutationFn: update,
    onSuccess(res) {
      toast.success("Cập nhật bài viết thành công");
      router.refresh();
      setContent("");
      setFile(null);
      setStatus(defaultStatus);
      toggleOpen(false);
      onSuccess?.(res);
    },
    onError() {
      toast.error("Cập nhật bài viết thất bại. Vui lòng thử lại sau");
    },
  });

  const handleClearFile = useCallback(() => {
    setFile(null);
    setMediaUrl("");
  }, []);
  const handleShowAddFile = useCallback(() => {
    inputFileRef.current?.click();
  }, []);
  const handleChangeFile = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFile(file);
    setMediaUrl(url);
  }, []);
  const handleChangeSelect = useCallback((val: string) => {
    setStatus(val);
  }, []);
  const handleEditorChange = useCallback((val: string) => {
    setContent(val);
  }, []);
  const handleStorePost = useCallback(() => {
    if (!currentUser) return;
    mutateStore({ groupId, content, status, file, userId: currentUser.id });
  }, [content, status, file, currentUser, mutateStore]);
  const handleUpdatePost = useCallback(() => {
    if (!currentUser || !data) return;
    mutateUpdate({
      postId: data.id,
      data: { groupId, content, status, file, userId: currentUser.id },
    });
  }, [content, status, data, file, currentUser, mutateUpdate]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!data) return toggleOpen(val);
      const isDirty =
        data?.content !== content || data?.file?.path !== mediaUrl;
      if (isDirty) return toggleModalConfirm(true);
      toggleOpen(val);
    },
    [data, content, file, mediaUrl, toggleOpen, toggleModalConfirm]
  );

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
          {!groupId && (
            <SelectActions
              defaultValue={defaultStatus}
              actions={actions}
              onChange={handleChangeSelect}
            />
          )}
        </div>
      </div>
    );
  }, [currentUser, groupId, userName, handleChangeSelect]);

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
            <div className="max-h-96 overflow-hidden overflow-y-auto mt-4 -mx-6 px-6">
              <CustomEditor
                data={content}
                placeholder={placeholder}
                onChange={handleEditorChange}
              />

              {/* PreviewFile: Image or Video */}
              {(!!file || !!mediaUrl) && (
                <PostingPreviewFile
                  path={mediaUrl}
                  type={data?.file?.type || file?.type}
                  onClear={handleClearFile}
                />
              )}

              {!file && !mediaUrl && (
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
              )}
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
          {!isUpdating && (
            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={isPendingStore || (!content && !mediaUrl)}
              onClick={handleStorePost}
            >
              Đăng
            </Button>
          )}
          {isUpdating && (
            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={isPendingUpdate || (!content && !mediaUrl)}
              onClick={handleUpdatePost}
            >
              Đăng
            </Button>
          )}
        </DialogFooter>

        <AlertModal
          open={modalConfirm}
          onOpenChange={toggleModalConfirm}
          onClick={() => {
            setContent("");
            setMediaUrl("");
            setFile(null);
            toggleOpen(false);
            setStatus(defaultStatus);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostingModal;
