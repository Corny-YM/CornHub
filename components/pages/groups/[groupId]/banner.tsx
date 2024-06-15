"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Images, Trash2, Upload } from "lucide-react";

import { removeCover, update } from "@/actions/group";
import { useToggle } from "@/hooks/useToggle";
import { useAppContext } from "@/providers/app-provider";
import { useGroupContext } from "@/providers/group-provider";
import { Button } from "@/components/ui/button";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import NoBackground from "@/public/no-background.jpg";
import AlertModal from "@/components/alert-modal";
import ModalFiles from "./modal-files";

const Banner = () => {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const { groupData, isGroupOwner } = useGroupContext();

  const [isSelecting, setIsSelecting] = useState(false);
  const [modalFiles, toggleModalFiles] = useToggle(false);
  const [modalConfirm, toggleModalConfirm] = useToggle(false);
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<string | null>(groupData?.cover);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!groupData) return;
    setCover(groupData.cover);
  }, [groupData]);

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["group", "update", "cover", groupData?.id],
    mutationFn: update,
    onSuccess(res) {
      toast.success("Cập nhật ảnh bìa thành công");
      router.refresh();
      setFile(null);
      setCover(res?.cover);
      setIsSelecting(false);
    },
    onError() {
      toast.error("Cập nhật ảnh bìa thất bại. Vui lòng thử lại sau");
    },
  });

  const { mutate: mutateRemoveCover, isPending: isPendingRemoveCover } =
    useMutation({
      mutationKey: ["group", "update", "cover", groupData?.id],
      mutationFn: removeCover,
      onSuccess() {
        toast.success("Xóa ảnh bìa thành công");
        router.refresh();
        setFile(null);
        setCover(null);
        setIsSelecting(false);
      },
      onError() {
        toast.error("Xóa ảnh bìa thất bại. Vui lòng thử lại sau");
      },
    });

  const handleChangeFile = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFile(file);
    setCover(previewUrl);
  }, []);

  const handleUpdateCover = useCallback(() => {
    if (currentUser?.id !== groupData?.owner_id || !groupData) return;
    mutateUpdate({ groupId: groupData.id, data: { cover: file || cover } });
  }, [file, groupData, cover, currentUser]);

  const handleRemovePreviewCover = useCallback(() => {
    if (currentUser?.id !== groupData?.owner_id) return;
    setFile(null);
    setIsSelecting(false);
    setCover(groupData?.cover);
  }, [groupData, currentUser]);

  const handleRemoveCover = useCallback(() => {
    if (currentUser?.id !== groupData?.owner_id || !groupData) return;
    mutateRemoveCover(groupData.id);
  }, [groupData, currentUser]);

  const handleSelectImage = useCallback((url: string) => {
    setCover(url);
    setIsSelecting(true);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }, []);

  const isShowEdit = useMemo(() => {
    if (!isGroupOwner) return false;
    else if (file) return false;
    else if (cover && isSelecting) return false;
    return true;
  }, [isGroupOwner, file, cover, isSelecting]);

  const disabled = useMemo(
    () => isPendingUpdate || isPendingRemoveCover,
    [isPendingUpdate, isPendingRemoveCover]
  );

  const actions = useMemo(() => {
    const result: IDropdownAction[] = [
      {
        label: "Chọn ảnh bìa",
        icon: <Images className="mr-2" />,
        onClick: () => toggleModalFiles(true),
      },
      {
        label: "Tải ảnh lên",
        icon: <Upload className="mr-2" />,
        onClick: () => inputFileRef.current?.click(),
      },
    ] as IDropdownAction[];
    if (groupData?.cover)
      result.push({
        label: "Gỡ",
        destructive: true,
        icon: <Trash2 className="mr-2" />,
        onClick: () => toggleModalConfirm(true),
      });
    return result;
  }, [groupData, currentUser]);

  return (
    <div className="relative w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
      <div className="relative w-full h-96 aspect-video flex items-center justify-center">
        <Image
          className="absolute w-full h-full object-cover"
          src={cover || NoBackground}
          alt="banner"
          fill
          sizes="100%"
          priority
        />
      </div>

      <div className="absolute right-4 bottom-4 flex items-center gap-x-2">
        {(file || (cover && isSelecting)) && (
          <div className="flex items-center gap-x-2">
            <Button variant="destructive" onClick={handleRemovePreviewCover}>
              Loại bỏ
            </Button>
            <Button onClick={handleUpdateCover}>Lưu thay đổi</Button>
          </div>
        )}
        {isShowEdit && (
          <DropdownActions
            size="default"
            disabled={disabled}
            actions={actions}
            icon={
              <div className="select-none flex items-center">
                <Camera size={20} className="mr-2" /> Chỉnh sửa ảnh bìa
              </div>
            }
          />
        )}
      </div>

      <input
        ref={inputFileRef}
        hidden
        multiple={false}
        style={{ display: "none" }}
        accept="image/*"
        type="file"
        onChange={handleChangeFile}
      />

      <AlertModal
        destructive
        open={modalConfirm}
        onClick={handleRemoveCover}
        onOpenChange={toggleModalConfirm}
      />

      <ModalFiles
        open={modalFiles}
        onOpenChange={toggleModalFiles}
        onSelect={handleSelectImage}
      />
    </div>
  );
};

export default Banner;
